const ws = require('ws')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {jwtSecret} = require('../utils/constants')
const Message = require('../models/Message')

const setupWebSocket = (server) => {
    const wss = new ws.WebSocketServer({ server })

    wss.on('connection', (connection, req) => {

        // notify others when someone connects
        function notifyAboutOnlinePeople() {
            [...wss.clients].forEach(client => {
                client.send(JSON.stringify({
                    online: [...wss.clients].map(c => ({ userID: c.userID, username: c.username }))
                }))
            })
        }

        connection.isAlive = true

        connection.timer = setInterval(() => {
            connection.ping()
            connection.deathTimer = setTimeout(() => {
                connection.isAlive = false
                clearInterval(connection.timer)
                connection.terminate()
                notifyAboutOnlinePeople()
            }, 5000);
        }, 30000)

        connection.on('pong', () => {
            clearTimeout(connection.deathTimer)
        })

        // read username and id from the cookie
        const cookies = req.headers.cookie
        if (cookies) {
            const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='))
            if (tokenCookieString) {
                const token = tokenCookieString.split('=')[1]
                if (token) {
                    jwt.verify(token, jwtSecret, {}, (err, userData) => {
                        if (err) throw err

                        const { userID, username } = userData
                        connection.userID = userID
                        connection.username = username
                    })
                }
            }
        }

        // send message data
        connection.on('message', async (message) => {
            messageData = JSON.parse(message.toString())
            const { recepient, text } = messageData
            if (recepient && text) {
                const messageDoc = await Message.create({
                    sender: connection.userID,
                    recepient: recepient,
                    text: text
                });
                // console.log(messageDoc);
                [...wss.clients]
                    .filter(c => c.userID === recepient)
                    .forEach(c => c.send(JSON.stringify({
                        text,
                        sender: connection.userID,
                        recepient,
                        id: messageDoc._id,
                    })))
            }
        });

        notifyAboutOnlinePeople()
    })

    return wss
}

module.exports = setupWebSocket