const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const ws = require('ws')
require('dotenv').config()

const app = express()

const User = require('./models/User')
const Message = require('./models/Message')

const mongo_uri = process.env.MONGO_URI
const jwtSecret = process.env.JWT_SECRET
const bcryptSalt = bcrypt.genSaltSync(10)

mongoose.connect(mongo_uri)

const allowedOrigins = [
    process.env.CLIENT_URL,
    /\.vercel\.app$/
].filter(Boolean)

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.some(allowed =>
            typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
        )) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}))
app.use(express.json())
app.use(cookieParser())

app.get('/test', (req, res) => {
    res.send("Hello world")
})

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
})

async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err
                resolve(userData)
            })
        }
        else {
            reject('No token')
        }
    })
}

app.get('/profile', (req, res) => {
    const token = req.cookies?.token
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err
            res.json(userData)
        })
    }
    else {
        res.status(401).send('No token')
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const foundUser = await User.findOne({ username })

    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password)

        if (passOk) {
            jwt.sign({ userID: foundUser._id, username }, jwtSecret, {}, (err, token) => {
                if (err) {
                    throw (err)
                }
                res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                    id: foundUser._id,
                })
            })
        }
        else {
            return res.status(401).json({ error: "Wrong password" })
        }
    }
    else {
        return res.status(404).json({ error: "User not found" })

    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '', { sameSite: 'none', secure: true }).status(201).json('Ok')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        let hashedPassword = password
        if (password && password.length >= 8) {
            hashedPassword = bcrypt.hashSync(password, bcryptSalt)
        }
        const createdUser = await User.create({
            username: username,
            password: hashedPassword
        })
        jwt.sign({ userID: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) {
                throw (err)
            }
            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: createdUser._id,
            })
        })
    } catch (err) {
        if (err.code === 11000) {
            res.status(409).json({ error: 'User already exists' })
        }
        else {
            res.status(500).json({ error: err.message })
        }
    }
})

app.get('/messages/:userID', async (req, res) => {
    const { userID } = req.params
    const userData = await getUserDataFromRequest(req)
    const senderID = userData.userID
    const messages = await Message.find({
        sender: { $in: [userID, senderID] },
        recepient: { $in: [userID, senderID] },
    }).sort({ createdAt: 1 }).exec()
    res.json(messages)
})

app.get('/people', async (req, res) => {
    const users = await User.find({}, { '_id': 1, username: 1 })
    res.json(users)
})

app.delete('/account', async (req, res) => {
    try {
        const userData = await getUserDataFromRequest(req)
        const id = userData.userID
        const user = await User.findOneAndDelete({ _id: id })
        if (!user) {
            return res.status(404).json({ err: "User not found" })
        }
        await Message.deleteMany({ $or: [{ sender: id }, { recepient: id }] })

        return res.cookie('token', '', { sameSite: 'none', secure: true }).status(200).json({ message: 'Account deleted successfully' })
    }
    catch (err) {
        res.status(500).json({ error: err.message })

    }
})

app.delete('/messages', async (req, res) => {
    try {
        const userData = await getUserDataFromRequest(req)
        const id = userData.userID

        await Message.deleteMany({ $or: [{ sender: id }, { recepient: id }] })

        return res.status(200).json({ message: 'Messages deleted successfully' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

const port = process.env.PORT || 4000

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

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