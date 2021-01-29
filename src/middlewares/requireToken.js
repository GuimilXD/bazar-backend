module.exports = (req, res, next) => {
    if(!req.decodedToken) return next(new Error("Token must be provided."))
    next()
}