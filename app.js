

require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const expressFileUpload = require('express-fileupload')
const morgan = require('morgan')
const connectionDb = require('./db/connection')


const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')


const {notFoundError, somethingWrongError, allFineError} = require('./controllers/error_handler_class/general_error_handler')
const routerService = require('./routers/basic_routing_service')
const userRouterService = require('./routers/user_router')
const productRouterService = require('./routers/product_router')
const reviewRouterService = require('./routers/reviews_router')
const orderRouterService = require('./routers/reviews_router')

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.set('trust proxy', 1)
app.use(
    rateLimiter(
        {
            windowMs: 15*60*1000,
            max: 60
        }
    )
)

app.use(helmet())
app.use(mongoSanitize())


app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('./public'))
app.use(expressFileUpload({useTempFiles: true}))
app.use(cors())



app.get("/", (req, res) => {
    try{
        console.log(req.signedCookies)
        res.send("welcome to the home page")
    }

    catch(err) {
        somethingWrongError(req, res, "Could not connect to the servers")
        //res.status(500).json({success: false, data: "Could not connect to the servers", metadata: {err}})
    }
})

app.get("/about", (req, res) => {
    try {
        res.send("this api has been created by sanidhya mishra.")
    }

    catch(err) {
        somethingWrongError(req, res, "Could not connect to the servers")
        //res.status(500).json({success: false, data:"Could not connect to the servers", metadata: {err}})
    }
})

app.use("/api/v1/ecommerce/auth", routerService)
app.use("/api/v1/ecommerce/users", userRouterService)
app.use("/api/v1/ecommerce/products", productRouterService)
app.use("/api/v1/ecommerce/reviews", reviewRouterService)
app.use("/api/v1/ecommerce/orders", orderRouterService)

const start = async(req, res) => {
    try {
        await connectionDb(String(process.env.MONGO_URI))
        app.listen(Number(process.env.PORT), console.log("app listening to port : "+String(process.env.PORT)))
    }

    catch(err) {
        somethingWrongError(req, res, "data could not be sent try again later.")
        //res.status(500).json({success: false, data: "data could not be sent try again later.", metadata: {err}})
        console.log(err)
    }
}

start()