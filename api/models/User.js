const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type:String,
        require: true,
    }
}, {timestamps: true})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel