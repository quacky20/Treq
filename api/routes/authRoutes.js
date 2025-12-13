const express = require('express')
const router = express.Router()

const {
    getProfile,
    login,
    logout,
    register
} = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/profile', getProfile)

module.exports = router