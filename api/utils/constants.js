const bcrypt = require('bcryptjs')

const jwtSecret = process.env.JWT_SECRET
const bcryptSalt = bcrypt.genSaltSync(10)

module.exports = {
    jwtSecret,
    bcryptSalt
}