const { ValidationError } = require("sequelize")

module.exports = (error, req, res, next) => {

    res.status(400).json({
        message: error.stack
        // message: error instanceof ValidationError 
        // ? 
        // error.message.split("\n").map(e => e.substr(e.indexOf(":")+1).trim()) 
        // : 
        // error.message
    })

}