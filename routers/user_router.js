const express = require('express')
const router = express.Router()
const {authenticateUser, authorizeMiddleware} = require('../controllers/auth_controller_service/auth_middleware')

const {
    getAllUsers,
    getSingleUser,
    showCurrentUsers,
    updateUser,
    updateUserPassword
} = require("../controllers/controller_service/user_controller_service")

router.route("/getallusers").get(authenticateUser, authorizeMiddleware("admin", "master", "owner"), getAllUsers)
router.route("/showcurrentusers").get(authenticateUser, showCurrentUsers)
router.route("/getsingleuser/:id").get(authenticateUser, getSingleUser)
router.route("/updateuser/:id").patch(authenticateUser, updateUser)
router.route("/updateuserpassword/:id").patch(authenticateUser, updateUserPassword)

module.exports = router
