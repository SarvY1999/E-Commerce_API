const CustomError = require('../errors');
const { isTokenValid } = require('../utils/jwt');

const authorizeUser = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthenticatedError('Authentication Invalid');
        }
        next();
    }
}

module.exports = {
    authorizeUser
}