const express = require('express')
const router = express.Router()
const {
    authenticateUser,
    authorizeMiddleware
} = require('../controllers/auth_controller_service/auth_middleware')

const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
} = require("../controllers/controller_service/product_controller_service")

const {getSingleProductReviews} = require('../controllers/controller_service/review_controller_service')


router.route("/createproduct")
.post(authenticateUser, authorizeMiddleware("admin", "master", "owner"), createProduct)

router.route("/getallproducts")
.get(getAllProducts)

router.route("/getsingleproduct/:id")
.get(getSingleProduct)

router.route("/updateproduct/:id")
.patch(authenticateUser, authorizeMiddleware("admin", "master", "owner"), updateProduct)

router.route("/deleteproduct")
.delete(authenticateUser, authorizeMiddleware("admin", "master", "owner"), deleteProduct)

router.route("/uploadimage")
.post(authenticateUser, authorizeMiddleware("admin", "master", "owner"), uploadImage)

router.route("/getsingleproductreviews")
.get(getSingleProductReviews)

module.exports = router

/*

//alternative routes to be used only during testing and not production.


router.route("/createproduct")
.post(createProduct)

router.route("/getallproducts")
.get(getAllProducts)

router.route("/getsingleproduct/:id")
.get(getSingleProduct)

router.route("/updateproduct/:id")
.patch(updateProduct)

router.route("/deleteproduct")
.delete(deleteProduct)

router.route("/uploadimage")
.post(uploadImage)

router.route("/getsingleproductreviews")
.get(getSingleProductReviews)


module.exports = router

*/