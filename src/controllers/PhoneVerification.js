const { VerificationCode, User } = require("../models")

const generateCode = require('generate-sms-verification-code')
const jwt = require("jsonwebtoken");


module.exports = PhoneVerification = {
    async check(req, res, next) {
        const { number, code } = req.query

        const verificationCode = await VerificationCode.findByPk(number);

        if (!verificationCode) return next(new Error("No code for this number was found."))

        if (verificationCode.attempts <= 0) {
            await verificationCode.destroy()
            return next(new Error("Too many incorrect tries. Try again later."))
        }

        if (verificationCode.code !== code) {
            verificationCode.attempts--
            await verificationCode.save()
            
            return next(new Error(`Invalid code. ${verificationCode.attempts} attempts left.`))
        }

        await verificationCode.destroy()

        const user = await User.getByNumber(number)

        user.verified = true

        await user.save()

        res.json({
            token: jwt.sign(user.id, process.env.JWT_SECRET)
        })
    },
    async verify(req, res, next) {
        try {
            const { number } = req.query

            await User.getByNumber(number)

            await PhoneVerification.sendSMS(number)

            res.end()
        } catch (error) {
            next(error)
        }
        
    },
    async sendSMS(number) {
        const code = generateCode(6)

        await VerificationCode.create({
            code,
            number,
        })
        
        const user = await User.getByNumber(number)

        console.log({
            token: jwt.sign(user.id, process.env.JWT_SECRET)
        })
        // send via sms
        console.log(`Mandei um SMS para ${number} com o código: ${code}`)

    },
}