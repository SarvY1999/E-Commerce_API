const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createJwt, isTokenValid, attachCookiesToResponse, createTokenUser } = require('../utils/jwt');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const ifExist = await User.findOne({ email });
    if (!ifExist) {
        throw new CustomError.BadRequestError('Email Already Exist');
    }
    const user = await User.create({ name, email, password });
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please Provide Email and Password');
    }
    const user = await User.findOne({ email });

    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser })
};

const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({ msg: 'User logout Successfully' });
};


module.exports = {
    register, login, logout
}