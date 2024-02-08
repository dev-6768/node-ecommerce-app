const {GeneralErrorHandler} = require('../error_handler_class/general_error_handler')
const {createJWT, isValidToken, attachCookiesToResponse, createUserToken, checkPermissions} = require('../../utils/auth_utils')
const {StatusCodes} = require('http-status-codes')

const authenticateUser = async (req, res, next) => {
    const signedToken = req.cookies.token

    console.log("value below")
    console.log(req.cookies.token)
    
    if(!signedToken) {
        console.log('auth_middleware: no token found')
        //next()
    }

    else{ 
        try {
            
            const payloadSignedToken = isValidToken(signedToken)
            console.log("auth_middleware : jwt verification complete.")
            console.log(payloadSignedToken)
            req.user = {name: payloadSignedToken.name, userId: payloadSignedToken.userId, role: payloadSignedToken.role}
            console.log("req.user : ", req.user)
            next()
        }

        catch(err) {
            res.status(StatusCodes.UNAUTHORIZED).json({success: false, data: "not authorized to view this information", metadata: err})

        }
        //console.log("auth_middleware : no token found")
    }
    //next()
}


const authorizeMiddleware = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)) {
            throw GeneralErrorHandler("Not authorized to view this information", StatusCodes.FORBIDDEN)
        }
        else{
            next();
        }
    }
    
    
}

module.exports = {
    authenticateUser,
    authorizeMiddleware
}