const mongoose = require('mongoose')
const { GeneralErrorHandler } = require('../controllers/error_handler_class/general_error_handler')
const { StatusCodes } = require("http-status-codes")

const reviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        min: [1, "Min rating is 1.0"],
        max: [5, "Max rating is 5.0"],
        required: [true, "Please provide a valid rating"],
    },

    title: {
        type: String,
        maxLength: [100, "Title should be less than 100 characters"],
        required: [true, "Please provide a valid title."],
    },

    review: {
        type: String,
        maxLength: 1000,
        required: [true, "Review should be less than 1000 characters"],
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'userSchema',
        required: true,
    },

    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'productSchema',
        required: true,
    }
}, {timestamps: true})

reviewSchema.index({product:1, user:1}, {unique: true})

reviewSchema.statics.calculateAverageRating = async function(productId) {
    const result = await this.aggregate([
        {
            $match:{
                product:productId
            }, 
        },

        {
            $group:{
                _id: null,
                averageRating: {
                    $avg:"$rating",
                },
                numOfReviews: {
                    $sum:1,
                },
            }
        }
    ])

    try {
        await this.model('productSchema').findOneAndUpdate(
            {_id:productId},
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0
            },
        )
    }
    
    catch(error) {
        throw new GeneralErrorHandler("Could not process average ratings or number of reviews for this product.", StatusCodes.INTERNAL_SERVER_ERROR)
    }
    console.log(result)
}

reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product);
})

reviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product); 
})

module.exports = mongoose.model('reviewSchema', reviewSchema)