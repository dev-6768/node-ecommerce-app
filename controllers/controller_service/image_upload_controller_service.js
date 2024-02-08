const express = require('express')
const path = require('path')
const cloudinary = require('cloudinary').v2
const {notFoundError, somethingWrongError, allFineError, GeneralErrorHandler} = require("../error_handler_class/general_error_handler")

const fs = require('fs')

const uploadImageService = async(req, res) => {
    try {
        console.log(req.files.image)
        let productImage = req.files.image
        const imagePath = path.join(
            __dirname,
            '../../public/uploads/',
            String(productImage.name)
        )

        await productImage.mv(path)
        res.status(201).json({success: true, data: "Image uploaded in local server", metadata: req.files.image })
    }

    catch(err) {
        throw new GeneralErrorHandler("uploadImage: Encountered an error", 401)
    }
}

const uploadImageToCloudinary = async(req, res) => {
    try {
        console.log(req.files.image.tempFilePath)
        const result = await cloudinary.uploader.upload(
            req.files.image.tempFilePath, {
                use_filename: true,
                folder: "ecommerce_file_product_uploads"
            }
        )

        console.log(result)
        fs.unlinkSync(req.files.image.tempFilePath)
        res.status(200).json({success: true, data: "Image uploaded successfully", metadata: result.secure_url})
    }

    catch(err) {
        throw new GeneralErrorHandler("uploadImageToCloudinary: Encountered an error.", 401)
    }
}

module.exports = {
    uploadImageToCloudinary
}