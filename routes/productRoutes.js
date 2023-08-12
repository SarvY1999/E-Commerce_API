const express = require('express');
const router = express.Router();
const {
    createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct, uploadImage
} = require('../controllers/productController');
const { authenticateUser } = require('../middleware/authentication');
const { authorizeUser } = require('../middleware/authorization');

router.route('/').get(getAllProduct)
    .post(authenticateUser, authorizeUser('admin'), createProduct);

router.route('/uploadImage').post(authenticateUser, authorizeUser('admin'), uploadImage);

router.route('/:id').get(getSingleProduct)
    .delete(authenticateUser, authorizeUser('admin'), deleteProduct)
    .patch(authenticateUser, authorizeUser('admin'), updateProduct);

module.exports = router