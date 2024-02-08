const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        maxLength: [50, "Name cannot be more than 50 characters."]
    },

    price: {
        type: Number,
        required: [true, 'Please provide product price.'],
        default: 0,
    },

    description: {
        type: String,
        required: [true, "Please provide a valid description"],
        maxLength: [1000, "Description cannot be more than 1000 words"],
        default: "No description"
    },

    image: {
        type:String,
        default: "/uploads/example.jpeg"
    },

    category: {
        type: String,
        enum: ["office", "kitchen", "bedroom"],
        required: [true, "Please provide category."]
    },

    company: {
        type: String,
        required: [true, "Please provide company name."],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: "{VALUE} is not supported. try another company."
        }
    },

    colors: {
        type: String,
        required: true,
    },

    freeShipping: {
        type: Boolean,
        default: false,
    },

    featured: {
        type: Boolean,
        default: false,
    },

    inventory: {
        type: Number,
        required: true,
        default: 15,
    },

    averageRating: {
        type: Number,
        default: 0,
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'userSchema',
        required: true,
    }
}, 
    {
        timestamps: true,
        toJSON:{virtuals: true},
        toObject: { virtuals: true},
    },
    
     
)


productSchema.virtual('reviews', {
    ref: 'reviewSchema',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
    match:{rating:5}
})

productSchema.pre('remove', async function(next) {  
    await this.model('reviewSchema').deleteMany({product: this._id}) 
})

module.exports = mongoose.model("productSchema", productSchema)