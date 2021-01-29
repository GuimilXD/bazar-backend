const fs = require("fs")
const { v4: uuid } = require("uuid")


module.exports = async (images, callback) => {
    for(image of images) {
        const [ type, extension ] = image.mimetype.split("/")

        const path = `${process.cwd()}${process.env.IMAGES_FOLDER}`
        
        const fileName = `${uuid()}.${extension}`

        fs.writeFileSync(path + fileName, image.buffer)

        await callback({
            ...image,
            name: fileName
        })
    }
}