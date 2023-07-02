const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    const ifExist = await User.findOne({ email });
    if (ifExist) {
        throw new CustomError.BadRequestError('Email Already Exist');
    }
    const user = await User.create(name, email, password);
    res.status(StatusCodes.CREATED).json(user)
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