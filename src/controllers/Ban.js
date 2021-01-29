const { Ban, Server, User } = require("../models")


module.exports = {
    async list(req, res, next) {
        try {
            const { server_id } = req.params
            
            res.json(await Ban.getBansByServerID(server_id))    
        } catch (error) {
            next(error)
        }
    },
    async banMember(req, res, next) {
        try {
            const { server_id } = req.params
            const { member_id } = req.body

            const server = await Server.getByID(server_id)

            await server.checkPermissions(req.decodedToken)

            if(await server.owner_id == member_id) throw new Error("You can't ban the owner.")

            if(!await server.removeMembers(member_id)) throw new Error("No such member.")

            const user = await User.getByID(member_id)
                
            await Ban.create({
                user_id: user.id,
                user_ip: user.ip,
                server_id,  
            })

            res.status(204).end()
        } catch (error) {
            next(error)
        }
    },
    async removeBan(req, res, next) {
        try {
            const { server_id, ban_id } = req.params

            const server = await Server.getByID(server_id)

            await server.checkPermissions(req.decodedToken)

            const ban = await Ban.getByID(ban_id)

            await ban.destroy()

            res.status(204).end()
        } catch (error) {
            next(error)
        }
    },
}