const rateLimitFactory = require("express-rate-limit")

const SECONDS = 1000
const MINUTES = 60 * SECONDS
const HOURS = 60 * MINUTES


module.exports = {
    createAccountRateLimit: rateLimitFactory({
        windowMs: 2 * HOURS,
        max: 5,
        handler: (req, res, next) => {
            const remainingTime = req.rateLimit.resetTime - Date.now()

            res.status(429).json({
                message: `Too many requests, please try again in ${remainingTime}`,
                remainingTime
            })
        }
    }),

    sendSMSRateLimit: rateLimitFactory({
        windowMs: 1 * HOURS,
        max: 2,
        handler: (req, res, next) => {
            const remainingTime = req.rateLimit.resetTime - Date.now()

            res.status(429).json({
                message: `Too many requests, please try again in ${remainingTime}`,
                remainingTime
            })
        }
    }),

    updateProductRateLimit: rateLimitFactory({
        windowMs: 10 * MINUTES,
        max: 5,
        handler: (req, res, next) => {
            const remainingTime = req.rateLimit.resetTime - Date.now()

            res.status(429).json({
                message: `Too many requests, please try again in ${remainingTime}`,
                remainingTime
            })
        }
    }),

    updateServerRateLimit: rateLimitFactory({
        windowMs: 10 * MINUTES,
        max: 5,
        handler: (req, res, next) => {
            const remainingTime = req.rateLimit.resetTime - Date.now()

            res.status(429).json({
                message: `Too many requests, please try again in ${remainingTime}`,
                remainingTime
            })
        }
    }),

    updateUserRateLimit: rateLimitFactory({
        windowMs: 10 * MINUTES,
        max: 5,
        handler: (req, res, next) => {
            const remainingTime = req.rateLimit.resetTime - Date.now()

            res.status(429).json({
                message: `Too many requests, please try again in ${remainingTime}`,
                remainingTime
            })
        }
    }),
}