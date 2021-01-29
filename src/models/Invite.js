const { Model, DataTypes } = require("sequelize")
const User = require("./User")
const Server = require("./Server")


class Invite extends Model {
    static init(connection) {
        super.init({
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: "Code is already in use."
                },
                validate: {
                    notNull: {
                        msg: "Code was not provided."
                    },
                    notEmpty: {
                        msg: "Code cannot be empty."
                    },
                },
            },
            inviter_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            server_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize: connection
        })
    }

    static associate(models) {
        this.belongsTo(models.User, {
            as: "inviter",
            foreignKey: "inviter_id"
        })

        this.belongsTo(models.Server, {
            as: "server",
            foreignKey: "server_id",
        })
    }
}

Invite.getByCode = async function(code) {
    const invite = await Invite.findOne({
        where: {
            code
        },
        include: [
            { 
                model: Server,
                as: "server"
            },
            {
                model: User,
                as: "inviter",
                attributes: User.publicData
            },
        ]
    })

    if(!invite) throw new Error("Invite doesn't exist.")

    return invite
}

Invite.prototype.checkPermission = async function(user_id) {
    if(this.inviter_id != user_id) throw new Error("You don't have permission on this invite.")
}


module.exports = Invite