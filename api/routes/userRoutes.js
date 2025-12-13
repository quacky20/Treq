const express = require('express')
const router = express.Router()

const {
    getPeople,
    deleteAccount
} = require('../controllers/userController')

router.get('/people', getPeople)
router.delete('/account', deleteAccount)

module.exports = router
