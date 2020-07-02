const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    console.log('auth middleware');

    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const findUser = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        });

        if (!findUser) {
            throw new Error();
        }
        req.token = token;
        req.user = findUser;

        next()
    } catch (e) {
        res.status(401).send({
            error: 'Please authenticate!!!'
        })
    }
};

module.exports = auth