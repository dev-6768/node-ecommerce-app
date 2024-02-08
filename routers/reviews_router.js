const express = require('express')
const router = express.Router()
const {authenticateUser} = require('../controllers/auth_controller_service/auth_middleware')
const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controllers/controller_service/review_controller_service')

router.route("/createreview").post(authenticateUser, createReview)
router.route("/getallreviews").get(authenticateUser, getAllReviews)
router.route("/getsinglereview/:id").get(authenticateUser, getSingleReview)
router.route("/updatereview/:id").patch(authenticateUser, updateReview)
router.route("/deletereview/:id").delete(authenticateUser, deleteReview)

module.exports = router
