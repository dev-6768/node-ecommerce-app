require('dotenv').config()
const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')

const oneDay = 1000 * 3600 * 24

const createJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
    return token
}

const isValidToken = (token) => {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    return payload
}

const attachCookiesToResponse = (res, token) => {
    res.cookie('token', 
        token, 
        {
            httpOnly: true, 
            expires: new Date(Date.now() + oneDay),
            secure: process.env.NODE_ENV === "production",
            sign: true,
        },
    )

    console.log("attachCookies : true")

    res.status(StatusCodes.CREATED).json({token})

}

const createUserToken = (user) => {
    const userTokenObject = {name: user.name, email: user.email, userId: user._id, role: user.role}
    return userTokenObject
}

const checkPermissions = (reqUser, reqUserId) => {
    if(reqUser.userId == String(reqUserId)) {
        return;
    }

    else if(reqUser.role == "admin") {
        return;
    }

    else{
        throw new GeneralErrorHandler("You are not authorized to view this information", StatusCodes.UNAUTHORIZED) 
    }
}

module.exports = {createJWT, isValidToken, attachCookiesToResponse, createUserToken, checkPermissions}

