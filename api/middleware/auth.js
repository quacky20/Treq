const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../utils/constants')

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

module.exports = { getUserDataFromRequest }