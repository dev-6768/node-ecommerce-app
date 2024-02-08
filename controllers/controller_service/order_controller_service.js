//IMPORTANT NOTE: FAKE FUNCTION IS USED IN STRIPE IN createOrder MIDDLEWARE.

const orderSchema = require('../../db/order_schema')
const cartSchema = require('../../db/cart_schema')
const { StatusCodes } = require('http-status-codes')
const {checkPermissions} = require('../../utils/auth_utils')
const productSchema = require('../../db/product_schema')
const { GeneralErrorHandler } = require('../error_handler_class/general_error_handler')

const fakeStripeApi = async({amount, currency}) => {
    const client_secret = 'someRandomClientSecret'
    return {client_secret, amount}
}

const createOrder = async(req, res) => {
    try {
        const {cartItems, tax, shippingFee} = req.body
        let subtotal = 0
        if(!cartItems || cartItems.length < 1) {
            throw new GeneralErrorHandler("No items in cart. go for shopping instead.", StatusCodes.BAD_REQUEST)
        }

        else if(!tax || !shippingFee) {
            throw new GeneralErrorHandler("No tax or shipping fee provided", StatusCodes.BAD_REQUEST)
        }

        else {
            let orderItems = []
            for(const item in cartItems) {
                const cartProduct = await productSchema.findOne({ _id: item.product })
                if(!cartProduct) {
                    throw new GeneralErrorHandler("Product not found", StatusCodes.NOT_FOUND)
                }

                const {name, price, image, _id} = cartProduct
                const singleOrderItem = {
                    amount: item.amount,
                    name,
                    price,
                    image,
                    product_id,
                }

                orderItems = [...orderItems, singleOrderItem]
                subtotal += item.amount*price

            }
        }

        const grandTotal = subtotal + tax + shippingFee

        const paymentIntent = await fakeStripeApi({
            amount: grandTotal,
            currency: 'usd'
        })

        const stripeOrder = await orderSchema.create({
            orderItems,
            total,
            subtotal,
            tax,
            shippingFee,
            clientSecret: paymentIntent.client_secret,
            user: req.user.userId
        })

        res.status(StatusCodes.CREATED).json({success: true, data: stripeOrder.clientSecret, metadata: { stripeOrder }})
    }

    catch(err) {
        throw GeneralErrorHandler("Could not connect to the servers", StatusCodes.INTERNAL_SERVER_ERROR)
    }
    
}

const getAllOrders = async(req, res) => {
    try {
        const getAllOrders = await orderSchema.find({ })
        res.status(StatusCodes.OK).json({ success: true, data: "all orders fetched", metadata: { getAllOrders } })
    }

    catch(err) {
        throw GeneralErrorHandler("Could not connect to the servers", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

const getSingleOrder = async(req, res) => {
    try {
        const {id: orderId} = req.params
        const getSingleOrder = await orderSchema.findOne({_id: orderId})
        if(!getSingleOrder) {
            throw new GeneralErrorHandler("Order not found", StatusCodes.NOT_FOUND)
        }

        checkPermissions(req.user, getSingleOrder.user)

        res.status(StatusCodes.OK).json({success: true, data: "Single order fetched", metadata: {getSingleOrder}})
    }

    catch(err) {
        throw GeneralErrorHandler("Could not connect to the servers", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

const getCurrentUserOrder = async(req, res) => {
    try {
        const getCurrentUserOrder = await orderSchema.findOne({ _id: req.user.userId })
        res.status(StatusCodes.OK).json({success: true, data: "Current order fetched", metadata: {getCurrentUserOrder}})
    }

    catch(err) {
        throw GeneralErrorHandler("Could not connect to the servers", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

const updateOrder = async(req, res) => {
    try {
        const {id: orderId} = req.params
        const getSingleOrder = await orderSchema.findOne({_id: orderId})
        const {paymentIntentId} = req.body
        
        if(!getSingleOrder) {
            throw new GeneralErrorHandler("Order not found", StatusCodes.NOT_FOUND)
        }

        checkPermissions(req.user, getSingleOrder.user)

        getSingleOrder.paymentIntentId = paymentIntentId,
        getSingleOrder.status = 'paid'
        await getSingleOrder.save()

        res.status(StatusCodes.OK).json({success: true, data: "Single order fetched", metadata: {getSingleOrder}})
    }

    catch(err) {
        throw GeneralErrorHandler("Could not connect to the servers", StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrder,
    updateOrder,
}