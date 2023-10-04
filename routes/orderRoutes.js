const express = require('express');
const router = express.Router();
const {
    createorder, getAllOrder, getCurrentUserOrders, getSingleOrder, updateOrder,
} = require('../controllers/orderController');

const { authenticateUser } = require('../middleware/authentication');
const { authorizeUser } = require('../middleware/authorization');


router.route('/').post( authenticateUser, createorder).get(authenticateUser,  authorizeUser('admin'), getAllOrder);
router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)
router.route('/:id').get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrder);

module.exports = router;


