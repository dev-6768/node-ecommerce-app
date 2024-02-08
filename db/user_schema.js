const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name."],
        minlength: 3,
        maxlength: 100,
    },

    email: {
        type: String,
        required: [true, "please provide password"],
        validate:{
            validator: validator.isEmail,
            message: "Please provide valid email.",
        }
    },

    password: {
        type: String,
        required: [true, "please provide password"],
        minlength: 6
    },

    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },


})

userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (candidate) {
    const isMatch = await bcrypt.compare(candidate, this.password)
    return isMatch
}

module.exports = mongoose.model("userSchema", userSchema)