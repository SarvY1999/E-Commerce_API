const Product = require('../models/Product');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const path = require('path');

const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const productDetails = req.body;
    if (!productDetails) {
        throw new CustomError.BadRequestError('Cannot Create Empty product');
    };
    const product = await Product.create(productDetails);
    res.status(StatusCodes.CREATED).json({ product });
};

const getAllProduct = async (req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ products });
};

const getSingleProduct = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId }).populate('reviews'); // you cannot query a virtual property, that is why created getSingleProductReview in Review Controller
    if (!product) {
        throw new CustomError.NotFoundError(`No product found with id ${productId}`)
    }
    res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, { new: true, runValidators: true });

    if (!product) {
        throw new CustomError.NotFoundError(`No product found with id ${productId}`)
    }

    res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });

    if (!product) {
        throw new CustomError.NotFoundError(`No product found with id ${productId}`)
    }

    await product.deleteOne(); // .remove() is removed since Mongoose 7, so if you are using Mongoose 7 and above, change .remove() to .deleteOne()
    res.status(StatusCodes.OK).json({ msg: "Product Deleted Successfully" });

};

const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new CustomError.BadRequestError('No file uploaded');
    }
    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please upload Image');
    };

    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError('Please upload Image smaller thar 1MB');
    }

    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })
};

module.exports = {
    createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct, uploadImage
};
