const { Model, DataTypes } = require("sequelize")



class Ban extends Model {
    static init(connection) {
        super.init({
            server_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
              },
            user_ip: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize: connection,
        })
    }

    static associate(models) {
        this.belongsTo(models.User, {
            as: "ban",
            foreignKey: "user_id",
        })
        this.belongsTo(models.Server, {
            as: "bans",
            foreignKey: "server_id",
        })
    }
}

Ban.getByID = async function (id) {
    const ban = await Ban.findByPk(id)

    if(!ban) throw new Error("Ban doesn't exist.")

    return ban 
}

Ban.getBansByServerID = async function(server_id) {
    return await Ban.findAll({
        where: {
            server_id
        }
    })
}



module.exports = Ban