const mongoose = require('mongoose')
const cartSchema = require('./cart_schema')
const orderSchema = mongoose.Schema({
    tax: {
        type: Number,
        required: true,
    },

    shippingFee: {
        type: Number,
        required: true,
    },

    subTotal: {
        type: Number,
        required: true,
    },

    shippingFee: {
        type: Number,
        required: true,
    },

    total: {
        type: Number,
        required: true,
    },

    cartItems: [cartSchema],

    status: {
        type: String,
        enum: ["pending", "failed", "paid", "delivered", "cancelled"],
        required: true,
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "userSchema",
        required: true,
    },

    clientSecret: {
        type: String,
        required: true,
    },

    paymentIntentId: {
        type: String,
    },



}, {timeStamps: true})

module.exports = mongoose.model('orderSchema', orderSchema)