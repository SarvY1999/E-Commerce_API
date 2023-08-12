const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils/jwt');
const checkPermission = require('../utils/checkPermissions');

const getAllUser = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(StatusCodes.OK).json({ users });
}
const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
    }
    checkPermission(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
}
const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json(req.user);
}
const updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new CustomError.BadRequestError('Please provide name and email');
    }
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
        throw new CustomError.NotFoundError('No User Found');
    }
    user.email = email;
    user.name = name;
    await user.save(); // the save here will trigger save hook defined on schema
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
}
const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both values');
    }
    const user = await User.findOne({ _id: req.user.userId });
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    };

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Password Updated' })
}


module.exports = {
    getAllUser, getSingleUser, showCurrentUser, updateUser, updateUserPassword
}


// updateUser with findOneAndUpdate
// const updateUser = async (req, res) => {
//     const { name, email } = req.body;
//     if (!name || !email) {
//         throw new CustomError.BadRequestError('Please provide name and email');
//     }
//     const user = await User.findOneAndUpdate({ _id: req.user.userId }, { email, name }, { new: true, runValidators: true });
//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({ res, user: tokenUser });
//     res.status(StatusCodes.OK).json({ user: tokenUser });
// }