require('dotenv').config()
const userSchema = require('../../db/user_schema')
const {StatusCodes} = require('http-status-codes')
const {notFoundError, somethingWrongError, allFineError, GeneralErrorHandler} = require('../error_handler_class/general_error_handler')
const bcrypt = require('bcrypt')
const { createJWT, attachCookiesToResponse, createUserToken, checkPermissions } = require('../../utils/auth_utils')

const getAllUsers = async(req, res) => {
    try {
        const getAllUsers = await userSchema.find({ role:"user" }).select('-password')
        res.status(StatusCodes.OK).json({ getAllUsers })
    }

    catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, data: "Could not fetch details.", metadata: "Could not fetch details from the server. Try again later."})
    }
    
}

const getSingleUser = async(req, res) => {
    try {
        const getSingleUser = await userSchema.findOne({ _id:req.params.id }).select('-password')
        if(!getSingleUser) {
            throw GeneralErrorHandler("User Not Found", 404)
        }

        else{
            checkPermissions(req.user, getSingleUser._id) //to secure the id url for a user
            res.status(StatusCodes.OK).json({ getSingleUser })
        }
    }

    catch(err) {
        throw new GeneralErrorHandler("Could not process query.", 500)
    }
}

const showCurrentUsers = async(req, res) => {
    try {
        res.status(StatusCodes.OK).json({success: true, data: "show data", metadata: req.user})
    }

    catch(err) {
        throw new GeneralErrorHandler("Could not process query.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

const updateUser = async(req, res) => {
    try {
        const {email, name} = req.body
        if(!email || !name) {
            throw new GeneralErrorHandler("Either no name or email is provided.", StatusCodes.BAD_REQUEST)
        }

        else{
            const user = await userSchema.findOneAndUpdate({_id: req.params.id}, {email, name}, {new: true, runValidators: true})
            const token = createUserToken(user)
            attachCookiesToResponse(res, token)
            res.status(StatusCodes.CREATED).json({success: true, data:"Successfully updated user!", metadata: {token}})
        }
    }

    catch(err) {
        throw new GeneralErrorHandler("Could not process query.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

const updateUserPassword = async(req, res) => { 
    try {
        const {oldPassword, newPassword} = req.body
        if(!oldPassword || !newPassword) {
            throw new GeneralErrorHandler("Bad request. Either no old password or new password is provided.", StatusCodes.BAD_REQUEST)
        }

        else{
            const user = await userSchema.findOne({ _id: req.user.userId })

            const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password)
            if(!isOldPasswordMatch) {
                throw new GeneralErrorHandler("Old password does not match", StatusCodes.FORBIDDEN)
            }

            else{
                user.password = newPassword
                await user.save()
                res.status(StatusCodes.OK).json({success: true, data: "Password updated successfully"})
            }
        }
    }

    catch(err) {
        throw new GeneralErrorHandler("Could not process query.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUsers,
    updateUser,
    updateUserPassword
}