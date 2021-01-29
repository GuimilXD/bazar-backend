const { Model, DataTypes } = require("sequelize")
const Image = require("./Image")
const User = require("./User")


class Product extends Model {
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
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize: connection
        })
    }
    
    static associate(models) {
        this.belongsTo(models.User, {
            as: "seller",
            foreignKey: "user_id"
        })
        this.belongsTo(models.Server, {
            as: "server",
            foreignKey: "server_id"
        })
        
        this.hasMany(models.Image, {
            as: "images",
            foreignKey: "product_id",
            onDelete: 'CASCADE',
            hooks: true 
        })
    }
}

Product.sellerNestedIncludeAttributes = [ "avatar" ]
Product.productPerPage = 10


Product.getByID = async function(product_id) {
    const product = await Product.findByPk(product_id, {
        include: [
            {
                model: User,
                as: "seller",
                attributes: User.publicData.filter(key => 
                    !Product.sellerNestedIncludeAttributes.includes(key)
                ),
                include: [
                    {
                        model: Image,
                        as: "avatar",
                        attributes: ["id", "name"]
                    }
                ],
            },
            {
                model: Image,
                as: "images",
            }
        ]
    })

    if(!product) throw new Error("Product doesn't exist.")

    return product
}

Product.getAllByIDs = async function(ids) {
    return await Product.findAll({
        where: {
            id: ids
        },
        include: [
            {
                model: User,
                as: "seller",
                attributes: User.publicData.filter(key => 
                    !Product.sellerNestedIncludeAttributes.includes(key)
                ),
                include: [
                    {
                        model: Image,
                        as: "avatar",
                        attributes: ["id", "name"]
                    }
                ],
            },
            {
                model: Image,
                as: "images",
            }
        ]
    })
}

Product.getAllByServerID = async function(server_id, page=0) {
    return (await Product.findAndCountAll({
        where: {
            server_id
        },
        offset: page * Product.productPerPage,
        limit: Product.productPerPage,
        include: [
            {
                model: User,
                as: "seller",
                attributes: User.publicData.filter(key => 
                    !Product.sellerNestedIncludeAttributes.includes(key)
                ),
                include: [
                    {
                        model: Image,
                        as: "avatar",
                        attributes: ["id", "name"]
                    }
                ],
            },
            {
                model: Image,
                as: "images",
            }
        ]
    })).rows
}

Product.prototype.checkPermissions = async function(user_id) {
    if(this.user_id != user_id) throw new Error("You don't have permissions on this product.")
}

module.exports = Product