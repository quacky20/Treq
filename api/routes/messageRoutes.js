const express = require('express')
const router = express.Router()

const {
    getMessages,
    deleteMessages
} = require('../controllers/messageController')

router.get('/messages/:userID', getMessages)
router.delete('/messages', deleteMessages)

module.exports = router
