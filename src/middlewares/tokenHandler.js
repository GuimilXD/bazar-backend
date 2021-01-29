const jwt = require("jsonwebtoken")
const User = require("../models/User")

module.exports = async (req, res, next) => {
    try {
        const { authorization: token } = req.headers

        if (!token) return next()

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        
        req.decodedToken = decodedToken

        next()
    } catch(error) {
        next(error)
    }
}