const { Model, DataTypes } = require("sequelize")
const Image  = require("./Image")

const { handleCPF, handleCEP, handlePhoneNumber } = require("../utils")
const models = require(".")


class User extends Model {
    static init(connection) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Name was not provided."
                    },
                    notEmpty: {
                        msg: "Name cannot be empty."
                    },
                },
            },
            cpf: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: "This CPF was already registered."
                },
                validate: {
                    notNull: {
                        msg: "CPF was not provided."
                    },
                    notEmpty: {
                        msg: "CPF was cannot be empty."
                    },
                    isCPF(value) {
                        this.setDataValue("cpf", handleCPF(value))
                    },
                },
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "Address was not provided."
                    },
                    notEmpty: {
                        msg: "Address cannot be empty."
                    },
                }
            },
            number: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: "This Number was already registered."
                },
                validate: {
                    notNull: {
                        msg: "Number was not provided."
                    },
                    notEmpty: {
                        msg: "Number cannot be empty."
                    },
                    isPhoneNumber(number) {
                        this.setDataValue("number", handlePhoneNumber(number))
                    }
                },
            },
            cep: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "CEP was not provided."
                    },
                    notEmpty: {
                        msg: "CEP cannot be empty."
                    },
                    async isCEP(cep) {
                        this.setDataValue("cep", await handleCEP(cep))
                    },
                },
            },
            ip: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: "IP was not provided."
                    },
                    notEmpty: {
                        msg: "IP cannot be empty."
                    },
                    isIP: {
                        msg: "IP was not valid."
                    }
                },
            },
            verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

        }, {
            hooks: {
                async afterCreate(model) {
                    model.verified = false
                    
                    await model.save()
                }
            },
            sequelize: connection
        })
    }

    static associate(models) {
        this.hasMany(models.Product, {
            as: "seller",
            foreignKey: "user_id"
        })

        this.belongsToMany(models.Server, {
            as: "members",
            foreignKey: "user_id",
            through: "servers_members",
        })

        this.hasMany(models.Ban, {
            as: "ban",
            foreignKey: "user_id"
        })

        this.hasMany(models.Image, {
            as: "image_owner",
            foreignKey: "user_id",
            onDelete: 'CASCADE',
            hooks: true 
        })

        this.hasOne(models.Image, {
            as: "avatar",
            foreignKey: "avatar_id",
        })
    }
}

User.publicData = ["id", "name", "avatar", "createdAt", "updatedAt"]
User.dataValues = ["id", "name", "cpf", "number", "address", "avatar", "createdAt", "updatedAt"]


User.prototype.getPublicData = function() {
    
    const result = {}
    User.publicData.forEach(key => {
        Object.assign(result,
            { [key]: this[key] }
        )
    })

    return result
}

User.prototype.getDataValues = function() {
    
    const result = {}
    User.dataValues.forEach(key => {
        Object.assign(result,
            { [key]: this[key] }
        )
    })
    return result
}

User.getByID = async function(id) {
    const user = await User.findByPk(id, {
        include: [
            {
                model: Image,
                as: "avatar",
                attributes: [ "id", "name" ]    
            },
        ]
    })

    if(!user) throw new Error("User doesn't exist.")

    return user
}

User.getByNumber = async function(number) {
    const user = await User.findOne({
        where: {
            number
        }
    })

    if(!user) throw new Error("User doesn't exist.")

    return user
}

User.prototype.checkByID = async function(id) {
    if(this.id != id) throw new Error("You don't have permissions on this user.")
}


module.exports = User