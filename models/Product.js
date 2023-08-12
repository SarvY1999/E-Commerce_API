const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        required: [true, "Please Provide a name"],
        type: String,
        trim: true,
        maxlength: [100, 'Cannot exceed beyond 100 characters']
    },
    price: {
        type: Number,
        required: [true, "Please Provide a price"],
        default: 0
    },
    description: {
        type: String,
        required: true,
        maxlength: [1000, 'Cannot exceed beyond 1000 characters']
    },
    image: {
        type: String,
        default: '/uploads/example.jpeg'
    },
    category: {
        type: String,
        required: [true, "Please Provide a category"],
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
        type: String,
        required: [true, "Please Provide a company"],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: '{VALUE} is not supported'
        },
    },
    colors: {
        type: [String],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    inventory: {
        type: Number,
        required: true,
        default: 15
    },
    averageRating: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, { timestamps: true },);

module.exports = mongoose.model('Product', ProductSchema);