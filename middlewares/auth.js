const jwt                               = require('jsonwebtoken');

/**
 * Authentication middleware to verify user using JWT token
 * @returns authorised user
 * @param {string} jwt_token
 */

module.exports = function auth(req, res, next) {

    const token = req.cookies.token

    if (!token) res.status(401).send('Access Denied... Login with valid user');

    try {

        const verified = jwt.verify(token, process.env.TOKEN_SECRET)

        req.user = verified;

        next();

    } catch (err) {

        if (err) {

            console.log(err);

            res.status(400).send('Oops...! Session Expired. Please login again');

        }
    }
}
