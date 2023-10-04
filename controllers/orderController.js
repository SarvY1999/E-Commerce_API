const Product = require('../models/Product');
const Order = require('../models/Order');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const checkPermission = require('../utils/checkPermissions');

const fakeStripeAPI = async({amount, currency}) => {
    const clientSecret = "random value";
    return {clientSecret, amount};
}

const createorder = async (req, res) => {
    const { items, tax, shippingFee } = req.body;
    if (!items || items.length < 1) {
        throw new CustomError.BadRequestError('No cart Items provided')
    };

    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please provided tax and shipping fee ')
    };

    let orderItems = [];
    let subtotal = 0;
 
    for (const item of items) {
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new CustomError.NotFoundError(`No product with product id: ${item.product}`)
        };

        const {name, price, image, _id} = dbProduct;

        const singleOrderItem = {
            amount: item.amount,
            name, price, image, product: _id
        }
        //Add item to order
        orderItems = [...orderItems, singleOrderItem];
        subtotal += item.amount * price;
    }
    // calculate total
    const total = tax + shippingFee + subtotal;
    //get client secret
    const payment  = await fakeStripeAPI({
        amount : total,
        currency: 'usd'
    })

    const order = await Order.create({
        orderItems, total, subtotal, tax, shippingFee, clientSecret: payment.clientSecret, user: req.user.userId
    })

    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret});
    // res.send('orfer')
}

const getAllOrder = async (req, res) => {

    const orders = await Order.find({});

    if(!orders){
        throw CustomError.BadRequestError('No orders found');
    }

    res.status(StatusCodes.OK).json({orders});
}

const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({user: req.user.userId})
    if (!orders) {
        throw new CustomError.NotFoundError('No orders found')
    };
    res.status(StatusCodes.OK).json({orders});
}

const getSingleOrder = async (req, res) => {
    const {id} = req.params;
    const order = await Order.findOne({_id : id});
    if(!order){
        throw new CustomError.NotFoundError(`No order found with id: ${id}}`)
    }
    checkPermission(req.user, order.user);
    res.status(StatusCodes.OK).json({order});
}

const updateOrder = async (req, res) => {
    const {id} = req.params;
    const {paymentIntentId} = req.body;

    const order = await Order.findOne({_id : id});

    if(!order){
        throw new CustomError.NotFoundError(`No order found with id: ${id}`)
    };
    checkPermission(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
};

module.exports = {
    createorder, getAllOrder, getCurrentUserOrders, getSingleOrder, updateOrder,
};
