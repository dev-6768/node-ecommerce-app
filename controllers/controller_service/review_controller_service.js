require('dotenv').config()
const reviewSchema = require("../../db/review_schema")
const productSchema = require("../../db/product_schema")
const {GeneralErrorHandler} = require("../../controllers/error_handler_class/general_error_handler")
const {StatusCodes} = require('http-status-codes')
const {checkPermissions} = require('../../utils/auth_utils')

const createReview = async(req, res) => {
    try{
        const {product: productId} = req.body
        req.body.user = req.user.userId
        const isProductValid = await productSchema.findOne({ _id: productId })
        if(!isProductValid) {
            throw new GeneralErrorHandler("No product found.", 404)
        }

        else{
            const isSubmittedAlready = await reviewSchema.findOne({_id: req.user.userId}) 
            if(isSubmittedAlready) {
                throw new GeneralErrorHandler("Review already submitted for this product", StatusCodes.FORBIDDEN)
            }

            else{
                const createReview = await reviewSchema.create(req.body)
                res.status(StatusCodes.CREATED).json({success: true, data: "Review created successfully", metadata: { reviewSchema }})
            }
        }
    }

    catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, data: "Could not create review for this product"})
    }
}

const getAllReviews = async(req, res) => {
    try {
        const getAllReviews = await reviewSchema.find({ }).populate({
            path: 'product',
            select: 'name price company',
        }).populate({
            path: 'user',
            select: 'name',
        })

        res.status(StatusCodes.OK).json({success: true, data: "Fetched all reviews", metadata: { getAllReviews }})
    }

    catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, data: "Internal error encountered", metadata: {err}})
    }
    
}

const getSingleReview = async(req, res) => {
    try {
        const {id: productId} = req.params
        const getSingleProduct = await reviewSchema.findOne({ _id: productId})
        
        if(!getSingleProduct) {
            throw new GeneralErrorHandler("Review not found", 404)
        }

        else{
            res.status(StatusCode.OK).json({success: true, data: "Reviews", metadata: { getSingleProduct }})
        }
    }

    catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, data: "Internal server error", metadata: { err }})
    }
}

const updateReview = async(req, res) => {
    try {
        const {id: productId} = req.params
        const isReviewValid = await reviewSchema.findOne({_id: productId})
        if(!isReviewValid) {
            throw new GeneralErrorHandler("Review not found", StatusCodes.NOT_FOUND)
        }

        else{
            checkPermissions(req.user, isReviewValid.user)
            const updateReview = await reviewSchema.findOneAndUpdate(req.body)
            res.status(StatusCodes.OK).json({success: true, data: "Review updated successfully", metadata: { updateReview }})
        }
    }

    catch(err) {
        throw GeneralErrorHandler("Internal server error encountered. try again later.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
     
}


const deleteReview = async(req, res) => {
    try {
        const {id: productId} = req.params
        const isReviewValid = await reviewSchema.findOne({_id: productId})
        if(!isReviewValid) {
            throw new GeneralErrorHandler("Product review not found", 404)
        }

        else{
            checkPermissions(req.user, isReviewValid.user)
            const deleteProduct = await reviewSchema.findOneAndDelete({_id: productId})
            res.status(StatusCodes.OK).json({success: true, data: "Product review deleted successfully", metadata: { deleteProduct }})
        }   
    }

    catch(err) {
        throw new GeneralErrorHandler("Internal server error encountered.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
    
}


const getSingleProductReviews = async(req, res) => {
    const {id: productId} = req.params
    const getSingleProductReviews = await reviewSchema.findOne({_id: productId})
    res.status(StatusCodes.OK).json({success: true, data: "reviews fetched", metadata: {getSingleProductReviews, count: getSingleProductReviews.length}})
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}