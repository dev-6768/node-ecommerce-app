require('dotenv').config()

const {StatusCodes} = require('http-status-codes')
const userSchema = require('../../db/user_schema')
const bcrypt = require('bcrypt')

require('../error_handler_class/general_error_handler')


const {createJWT, isValidToken, attachCookiesToResponse, createUserToken} = require('../../utils/auth_utils')
const { notFoundError, GeneralErrorHandler } = require('../error_handler_class/general_error_handler')

const registerFunction = async(req, res) => {
    try {
        const { name,email,password } = req.body

        const isEmailUnique = await userSchema.findOne({ email })
        if(isEmailUnique) {
            res.status(StatusCodes.NOT_ACCEPTABLE).json( { success: false, data:"This email already exists", metadata:"try to create a different email."} )
        }

        else{
            userRole = ""
            const isFirstUser = await userSchema.countDocuments({}) === 0
            console.log("isFirst user : " + isFirstUser)
            if(isFirstUser) {
                userRole = "admin"
            }

            else{
                userRole = "user"
            }

            console.log("user : " + userRole)
            

            const user = await userSchema.create({name, email, password, userRole})
            //const userToken = {name: user.name, email: user.email, id: user._id, role: user.role}

            const userToken = createUserToken(user)

            console.log("userToken : " + userToken)
            
            const jwtUserToken = createJWT(userToken)
            console.log(jwtUserToken)
            attachCookiesToResponse(res, jwtUserToken)
        }
    }

    catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, data:"Encountered an error.", metadata: { err } }) 
    }
    
    
}

const loginFunction = async(req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        throw new GeneralErrorHandler("Bad Request. Please provide email and password to login.", StatusCodes.BAD_REQUEST)
    }

    else{
        const user = await userSchema.findOne({ email })
        if(!user) {
            throw new GeneralErrorHandler("Bad Request. user account does not exist", StatusCodes.BAD_REQUEST)
        }

        else{
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if(!isPasswordValid) {
                throw new GeneralErrorHandler("Either username or password is incorrect.", StatusCodes.BAD_REQUEST)
            }

            else{
                //const userToken = {name: user.name, email: user.email, id: user._id, role: user.role}
                const userToken = createUserToken(user)
                const userJwtToken = createJWT(userToken)
                console.log("userJwtToken : " + userJwtToken)
                attachCookiesToResponse(res, userJwtToken)
            }
        }
    }


}



const logoutFunction = async(req, res) => {
    res.cookie(
        'token',
        'logout',
        {
            httpOnly: true,
            expiresIn: new Date(Date.now())
        }
    )

    res.status(StatusCodes.OK).json({success: true, data: "logged out successfully!", metadata: "No user currently."})
}




module.exports = {registerFunction, loginFunction, logoutFunction}