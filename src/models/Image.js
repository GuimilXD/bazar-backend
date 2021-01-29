const { Model, DataTypes } = require("sequelize")


class Image extends Model {
    static init(connection) {
        super.init({
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            server_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            avatar_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        }, {
            hooks: {
                afterDestroy: (image) => {
                    const fs = require("fs")
                    
                    fs.rmSync(`${process.cwd()}${process.env.IMAGES_FOLDER}${image.name}`)
                }
            },
            
            sequelize: connection,
        })
    }

    static associate(models) {
        this.belongsTo(models.Product, {
            as: "images",
            foreignKey: "product_id",
        })
        
        this.belongsTo(models.Server, {
            as: "image",
            foreignKey: "server_id",
        })
        
        this.belongsTo(models.User, {
            as: "image_owner",
            foreignKey: "user_id",
        })

        this.belongsTo(models.User, {
            as: "avatar",
            foreignKey: "avatar_id",
        })
    }
}

Image.getByID = async function(id) {
    const image = await Image.findByPk(id)

    if(!image) throw new Error("Image doesn't exist.")

    return image
}


module.exports = Image