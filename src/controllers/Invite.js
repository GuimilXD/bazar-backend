const { Server, Invite } = require("../models")


module.exports = {
    async create(req, res, next) {
        try {
            const data = req.body
            const user_id = req.decodedToken

            const server = await Server.getByID(data.server_id)

            await server.isMember(user_id)

            const invite = await Invite.create({
                ...data,
                inviter_id: user_id,
            })

            res.json(invite)
        } catch (error) {
            next(error)
        }
    },
    async list(req, res, next) {
        res.json(await Invite.findAll())
    },
    async getByCode(req, res, next) {
        try {
            const { invite_code } = req.params

            const invite = await Invite.getByCode(invite_code)

            res.json(invite)
        } catch(error) {
            next(error)
        }
    },
    async delete(req, res, next) {
        try {
            const { invite_code } = req.params

            const invite = await Invite.getByCode(invite_code)

            await invite.checkPermission(req.decodedToken)

            await invite.destroy()

            res.status(204).end()
        } catch(error) {
            next(error)
        }
    },
    async use(req, res, next) {
        try {
            const { invite_code } = req.params

            const invite = await Invite.getByCode(invite_code)

            const server = await Server.getByID(invite.server_id)

            if(await server.isBanned({
                user_id: req.decodedToken,
                user_ip: req.ip
            })) throw new Error("You're banned in this server.")

            if(await server.isMember(req.decodedToken)) throw new Error("You're already in this server.")

            await server.addMembers(req.decodedToken)

            res.json(server)
        } catch (error) {
            next(error)
        }
    },
}