const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { jwtSecret, bcryptSalt } = require('../utils/constants')

const User = require('../models/User')

const getProfile = (req, res) => {
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
}

const login = async (req, res) => {
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
}

const logout = (req, res) => {
    res.cookie('token', '', { sameSite: 'none', secure: true }).status(201).json('Ok')
}

const register = async (req, res) => {
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
}

module.exports = {
    getProfile,
    login,
    logout,
    register
}