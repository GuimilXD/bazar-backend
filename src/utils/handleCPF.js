const { format, isValid } = require("cpf")

module.exports = cpf => {
    if (isValid(cpf, true)) return format(cpf)

    throw new Error("CPF provided is not valid.")
}