require('dotenv').config()
const productSchema = require('../../db/product_schema')
const {notFoundError, somethingWrongError, allFineError, GeneralErrorHandler} = require('../error_handler_class/general_error_handler')
const {StatusCodes} = require('http-status-codes')

const {
    uploadImageToCloudinary
} = require('./image_upload_controller_service')

const createProduct = async(req, res) => {
    try {
        req.body.user = req.user.userId
        const product = await productSchema.create(req.body)
        res.status(StatusCodes.CREATED).json({success: true, data: "product created successfully", metadata: { product }})
    }

    catch(err) {
        throw new GeneralErrorHandler("Could not process query.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

const getAllProducts = async(req, res) => {
    try {
        const getAllProducts = await productSchema.find({ })
        console.log(getAllProducts)
        res.status(StatusCodes.OK).json({success:true, data:"Products fetched", metadata: { getAllProducts }})
    }

    catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: true, data: "An error encountered", metadata: { err }})
        throw new GeneralErrorHandler("Could not process query.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

const getSingleProduct = async(req, res) => {
    try {
        const productId = req.params.id
        const getSingleProduct = await productSchema.findOne({_id: productId}).populate('reviews')
        res.status(StatusCodes.CREATED).json({success: true, data: "Successfully fetched product", metadata: { getSingleProduct }})
    }

    catch(err) {
        throw new GeneralErrorHandler("Could not process query.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

const updateProduct = async(req, res) => {
    try {
        const productId = req.params.id
        const updateProduct = await productSchema.findOneAndUpdate({_id: productId}, req.body)
        res.status(StatusCodes.OK).json({success: true, data: "Successfully updated product", metadata: { updateProduct }})
    }

    catch(err) {
        throw new GeneralErrorHandler("Could not process query.", StatusCodes.INTERNAL_SERVER_ERROR)
    }    
}

const deleteProduct = async(req, res) => {
    try {
        const productId = req.params.id

        const removeProduct = await productSchema.findOne({_id: productId})
        if(!removeProduct) {
            throw new GeneralErrorHandler("Product does not exist", StatusCodes.NOT_FOUND)
        }

        else{
            await removeProduct.remove()
            res.status(StatusCodes.OK).json({success: true, data: "Successfully deleted product with product id : " + String(productId)})
        }
        
    }

    catch(err) {
        throw new GeneralErrorHandler("Could not process query.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

const uploadImage = async(req, res) => {
    try {
        await uploadImageToCloudinary(req, res)
    }

    catch(err) {
        throw new GeneralErrorHandler("Could not process query.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}