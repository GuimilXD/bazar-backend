const { Product, Image, Server } = require("../models")
const SonicSearchController = require("./SonicSearch")


const { saveImages } = require("../utils")


module.exports = {
    async create(req, res, next) {
        try {
            const data = req.body
            const { server_id } = req.params

            data.user_id = req.decodedToken

            data.server_id = server_id

            const server = await Server.getByID(server_id)

            if(!await server.isMember(req.decodedToken)) return res.status(403).end()

            const product = await Product.create(data)

            await SonicSearchController.ingest("products", server.id, product.id, `${product.name}${product.description}`)
            
            res.status(201).json(product)
        } catch(error) {
            next(error)
        }
    },
    async list(req, res, next) {
        try {
            const { server_id } = req.params
            const { query, page } = req.query  
            
            const server = await Server.getByID(server_id)
            
            if(!await server.isMember(req.decodedToken)) return res.status(403).end()
            
            if(!query) return res.json(await Product.getAllByServerID(server.id, page))

            const productsIDs = await SonicSearchController.search("products", server.id, query, page)

            res.json(await Product.getAllByIDs(productsIDs))
        } catch (error) {
            next(error)
        }
    },
    async getByID(req, res, next) {
        try {
            const { server_id, product_id } = req.params

            const server = await Server.getByID(server_id)

            if(!await server.isMember(req.decodedToken)) return res.status(403).end()

            const product = await Product.getByID(product_id)

            res.json(product)
        } catch(error) {
            next(error)
        }
    },
    async update(req, res, next) {
        try {
            const { server_id, product_id } = req.params
            const data = req.body
            
            const server = await Server.getByID(server_id)

            if(!await server.isMember(req.decodedToken)) return res.status(403).end()

            data.user_id = undefined

            const product = await Product.getByID(product_id)

            await product.checkPermissions(req.decodedToken)

            await SonicSearchController.updateIngest("products", server_id, product.id, `${product.name}${product.description}`)

            await product.update(data)


            res.status(200).end()
        } catch(error) {
            next(error)
        }
    },
    async delete(req, res, next) {
        try {
            const { server_id, product_id } = req.params


            const server = await Server.getByID(server_id)

            if(!await server.isMember(req.decodedToken)) return res.status(403).end()

            const product = await Product.getByID(product_id)

            await product.checkPermissions(req.decodedToken)
            
            await SonicSearchController.removeIngest("products", server.id, product.id)

            await product.destroy()

            res.status(204).end()
        } catch(error) {
            next(error)
        }
    },
    async addImages(req, res, next) {
        try {
            const { product_id } = req.params

            const files = req.files
            const imageLimit = process.env.IMAGE_PER_PRODUCT_LIMIT
            
            if(!files) return next(new Error("No files were selected."))
            
            const product = await Product.getByID(product_id)

            await product.checkPermissions(req.decodedToken)

            const totalImages = files.length + product.images.length
            
            if(totalImages > imageLimit)
                return next(new Error(`${imageLimit} images limit reached.`))

            saveImages(files, async image => {
                await Image.create({
                    name: image.name,
                    product_id: product.id,
                    user_id: req.decodedToken
                })
            })
            
            res.end()
        } catch (error) {
            next(error)
        }
    },
    async removeImages(req, res, next) {    
        try {
            const { product_id, image_id } = req.params

            const product = await Product.getByID(product_id)

            await product.checkPermissions(req.decodedToken)

            const image = await Image.getByID(image_id)

            if (image.product_id != product.id) return res.status(403).end()

            await image.destroy()

            res.status(204).end()
        } catch (error) {
            next(error)
        }
    },
}
