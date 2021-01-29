const { isMobilePhone } = require("validator") 


module.exports = number => {
    

    if (isMobilePhone(number, "", {
        strictMode: true
    })) 
    return number
    
    throw new Error("Phone number was not valid.")
}