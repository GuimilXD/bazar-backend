const { Model, DataTypes, Op } = require("sequelize")
const Image = require("./Image")
const User = require("./User")
const Ban = require("./Ban")


class Server extends Model {
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
            description: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    notEmpty: {
                        msg: "Description cannot be empty."
                    },
                },
            },
            owner_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize: connection
        })
    }

    static associate(models) {
        this.belongsTo(models.User, {
            as: "owner",
            foreignKey: "owner_id",
        })

        this.hasOne(models.Image, {
            as: "image",
            foreignKey: "server_id",
            onDelete: 'CASCADE',
            hooks: true ,
        })

        this.belongsToMany(models.User, {
            as: "members",
            foreignKey: "server_id",
            through: "servers_members",
        })
    }
}

Server.sellerNestedIncludeAttributes = [ "avatar" ]

Server.getByID = async function(id) {
    const server = await Server.findByPk(id, {
        include: [
            {
                model: Image,
                as: "image",
                attributes: [ "id", "name" ]
            },
            {
                model: User,
                as: "owner",
                attributes: User.publicData.filter(key => 
                    !Server.sellerNestedIncludeAttributes.includes(key)
                ),
                include: [
                    {
                        model: Image,
                        as: "avatar",
                        attributes: ["id", "name"]
                    }
                ],
            },
        ], 
    })

    if(!server) throw new Error("Server doesn't exist.")

    
    return server
}

Server.prototype.isMember = async function(user_id) {
    const memberList = await this.getMembers()

    let isMemberBool = false
    for(const member of memberList) {
        if(user_id != member.id) continue 
        
        isMemberBool = true
        break
    }
    
    return isMemberBool
}

Server.prototype.isBanned = async function({
    user_id,
    user_ip
}) {
    const ban = await Ban.findOne({
        where: {
            [Op.or]: [ { user_id }, { user_ip }],
            server_id: this.id 
        }
    })

    return !!ban
}

Server.prototype.checkPermissions = async function(user_id) {
    if(this.owner_id != user_id) throw new Error("You don't have permissions on this server.")
}

module.exports = Server