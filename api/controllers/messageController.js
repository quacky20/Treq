const Message = require('../models/Message')

const { getUserDataFromRequest } = require('../middleware/auth')

const getMessages = async (req, res) => {
    const { userID } = req.params
    const userData = await getUserDataFromRequest(req)
    const senderID = userData.userID
    const messages = await Message.find({
        sender: { $in: [userID, senderID] },
        recepient: { $in: [userID, senderID] },
    }).sort({ createdAt: 1 }).exec()
    res.json(messages)
}

const deleteMessages = async (req, res) => {
    try {
        const userData = await getUserDataFromRequest(req)
        const id = userData.userID

        await Message.deleteMany({ $or: [{ sender: id }, { recepient: id }] })

        return res.status(200).json({ message: 'Messages deleted successfully' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    getMessages,
    deleteMessages
}