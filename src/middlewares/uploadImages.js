const multer = require("multer")


const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) return callback(null, true)

    return callback(new Error("Upload only images with less than 2.5MB."), false)
}

module.exports = multer({
    fileFilter
})