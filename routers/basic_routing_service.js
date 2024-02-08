const express = require('express')
const router = express.Router()

const {registerFunction, loginFunction, logoutFunction} = require("../controllers/auth_controller_service/auth_controller")

router.route("/register").post(registerFunction)
router.route("/login").post(loginFunction)
router.route("/logout").get(logoutFunction)

module.exports = router