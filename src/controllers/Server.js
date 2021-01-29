const { Server, Image, Ban, User } = require("../models")
const { saveImages } = require("../utils")


module.exports = {
    async create(req, res, next) {
        try {
            const data = req.body

            const server = await Server.create({
                ...data,
                owner_id: req.decodedToken
            })

            await server.addMembers(server.owner_id)

            res.json(server)
        } catch (error) {
            next(error)
        }
    },
    async list(req, res, next) {
        res.json(await Server.findAll())
    },
    async getByID(req, res, next) {
        try {
            const { server_id } = req.params

            const server = await Server.getByID(server_id)

            if(!await server.isMember(req.decodedToken)) return res.status(403).end()

            res.json(server)
        } catch(error) {
            next(error)
        }
    },
    async update(req, res, next) {
        try {
            const { server_id } = req.params
            const data = req.body
            
            data.owner_id = undefined
            
            const server = await Server.getByID(server_id)

            await server.checkPermissions(req.decodedToken)

            await server.update(data)

            res.status(200).end()
        } catch(error) {
            next(error)
        }
    },
    async delete(req, res, next) {
        try {
            const { server_id } = req.params

            const server = await Server.getByID(server_id)

            await server.checkPermissions(req.decodedToken)

            await server.destroy()

            res.status(204).end()
        } catch(error) {
            next(error)
        }
    },
    async setImage(req, res, next) {
        try {
            const { server_id } = req.params
            const file = req.file

            const server = await Server.getByID(server_id)

            await server.checkPermissions(req.decodedToken)
            
            if(!file) return next(new Error("No file was selected."))

            if(server.image) await server.image.destroy()
            
            saveImages([ file ], async image => {
                await Image.create({
                    name: image.name,
                    server_id: server.id,
                    user_id: req.decodedToken
                })
            })
            
            res.status(201).end()
        } catch (error) {
            next(error)
        }
    },
    async kickMember(req, res, next) {
        try {
            const { server_id, member_id } = req.params

            const server = await Server.getByID(server_id)

            await server.checkPermissions(req.decodedToken)

            if(await server.owner_id == member_id) throw new Error("You can't kick the owner.")

            if(!await server.removeMembers(member_id)) throw new Error("No such member.")

            res.status(204).end()
        } catch (error) {
            next(error)
        }
    },
}