const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Enter username'],
        unique: true,
    },
    password:{
        type:String,
        required: [true, 'Enter password'],
        minlength: [8, 'Password should have 8 characters']
    }
}, {timestamps: true})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel