const cepValidator = require("cep-promise")

module.exports = cep => {   
    return cepValidator(cep)
    .then(result => result.cep)
    .catch(() => {
        throw new Error("CEP was not found.") 
    })
}