const express = require('express')
const router = express.Router()

const {
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrder,
    updateOrder,
} = require('../controllers/controller_service/order_controller_service')

const {
    authenticateUser,
    authorizeMiddleware
} = require('../controllers/auth_controller_service/auth_middleware')


router.route("/createorder").post(authenticateUser, createOrder)
router.route("/getallorders").get(authenticateUser, authorizeMiddleware("admin", "master", "owner"), getAllOrders)
router.route("/getsingleorder/:id").get(authenticateUser, authorizeMiddleware("admin", "master", "owner"), getSingleOrder)
router.route("/getcurrentuserorder/:id").get(authenticateUser, getCurrentUserOrder)
router.route("/updateorder/:id").patch(authenticateUser, updateOrder)

module.exports = router
