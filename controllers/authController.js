const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { createJwt, isTokenValid, attachCookiesToResponse } = require('../utils/jwt');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const ifExist = await User.findOne({ email });
    if (ifExist) {
        throw new CustomError.BadRequestError('Email Already Exist');
    }
    const user = await User.create({ name, email, password });
    const tokenUser = { name: user.name, userId: user._id, role: user.role }
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser })
};

const login = async (req, res) => {
    res.send("login")
};

const logout = async (req, res) => {
    res.send("logout")
};


module.exports = {
    register, login, logout
}