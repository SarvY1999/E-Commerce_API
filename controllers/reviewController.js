const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const checkPermission = require('../utils/checkPermissions');

const createReview = async (req, res) => {
    const {product: productId} = req.body;  // { property : alias } = object
    const isValidProduct = await Product.findOne({_id: productId});

    if(!isValidProduct){
        throw new CustomError.NotFoundError(`No Product found with ${productId}`)
    };
    
    const alreadySubmitted = await Review.findOne({product: productId, user: req.user.userId});
    
    if(alreadySubmitted){
        throw new CustomError.NotFoundError(`Already submitted a review for this product`)
    };

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({review});
};
const getAllReviews = async (req, res) => {
    const reviews = await Review.find({}).populate({path: 'product', select: "name company"});
    res.status(StatusCodes.OK).json({reviews, count: reviews.length});
};
const getSingleReview = async (req, res) => {
    const {id: reviewId } = req.params;

    const review = await Review.findOne({_id : reviewId}).populate({path: 'product', select: "name company"}).populate({path: 'user', select: 'name'});

    if(!review) {
        throw new CustomError.NotFoundError(`No Product found with ${reviewId}`);
    }

    res.status(StatusCodes.OK).json({review});
};
const updateReview = async (req, res) => {
    const {id: reviewId } = req.params;
    const {rating, title, comment} = req.body;

    if(!rating || !title || !comment) {
        throw new CustomError.BadRequestError(`Empty fields are not allowed`);
    }

    const review = await Review.findOne({_id : reviewId});

    if(!review) {
        throw new CustomError.NotFoundError(`No Product found with ${reviewId}`);
    }
    checkPermission(req.user, review.user);
    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();

    res.status(StatusCodes.OK).json(review);
};
const deleteReview = async (req, res) => {
    const {id: reviewId } = req.params;

    const review = await Review.findOne({_id : reviewId});

    if(!review) {
        throw new CustomError.NotFoundError(`No Product found with ${reviewId}`);
    }
    checkPermission(req.user, review.user);
    await review.remove();
    await Review.calculateAverageRating(review.product);

    res.status(StatusCodes.OK).json({msg: "Review deleted Sucessfully"});
};

const getSingleProductReview = async (req, res) => {
    const {id : productId} = req.params;
    const reviews = await Review.find({product: productId});

    res.status(StatusCodes.OK).json({reviews});

}
module.exports = {
    createReview, getAllReviews, getSingleReview, updateReview, deleteReview,getSingleProductReview
}