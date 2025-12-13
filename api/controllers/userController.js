const User = require('../models/User')
const Message = require('../models/Message')

const { getUserDataFromRequest } = require('../middleware/auth')

const getPeople = async (req, res) => {
    const users = await User.find({}, { '_id': 1, username: 1 })
    res.json(users)
}

const deleteAccount = async (req, res) => {
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
}

module.exports = {
    getPeople,
    deleteAccount
}