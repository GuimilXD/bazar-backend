const { User, Image } = require("../models")

const { saveImages } = require("../utils")


module.exports = {
    async create(req, res, next) {
        const { sendSMS } = require("./PhoneVerification")

        try {
            const data = req.body
            
            data.ip = req.ip

            const user = await User.create(data)
            
            await sendSMS(data.number)
            
            res.status(201).json(user.getDataValues())
        } catch(error) {
            next(error)
        }
    },
    async list(req, res, next) {
        res.json(await User.findAll())
    },
    async getByID(req, res, next) {
        try {
            const { user_id } = req.params

            const user = await User.getByID(user_id)

            if(req.decodedToken != user.id) return res.json(user.getPublicData())

            res.json(user.getDataValues())

        } catch(error) {
            next(error)
        }
    },
    async update(req, res, next) {
        try {
            const { user_id } = req.params
            const data = req.body
            
            data.cpf = undefined

            const user = await User.getByID(user_id)
            
            await user.checkByID(req.decodedToken)

            await user.update(data)

            res.status(200).end()
        } catch(error) {
            next(error)
        }
    },
    async delete(req, res, next) {
        try {
            const { user_id } = req.params

            const user = await User.getByID(user_id)
            
            await user.checkByID(req.decodedToken)

            await user.destroy()

            res.status(204).end()
        } catch(error) {
            next(error)
        }
    },
    async setImage(req, res, next) {
        try {
            const { user_id } = req.params
            const file = req.file

            const user = await User.getByID(user_id)

            await user.checkByID(req.decodedToken)

            if(!file) return next(new Error("No file was selected."))

            if(user.avatar) await user.avatar.destroy()

            saveImages([ file ], async image => {
                await Image.create({
                    name: image.name,
                    user_id: req.decodedToken,
                    avatar_id: req.decodedToken
                })
            })
            
            res.status(201).end()
        } catch (error) {
            next(error)
        }
    },
}
