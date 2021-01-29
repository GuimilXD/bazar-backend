const Sequelize = require("sequelize")
const dbConfig = require("../config/database")


const { 
    User,
    Product,
    Image,
    VerificationCode,
    Server,
    Invite,
    Ban
} = require("../models")


const database = new Sequelize(dbConfig)


User.init(database) 
Product.init(database)
Server.init(database)
Image.init(database)
VerificationCode.init(database)
Invite.init(database)
Ban.init(database)

User.associate(database.models)
Product.associate(database.models)
Server.associate(database.models)
Image.associate(database.models)
Invite.associate(database.models)
Ban.associate(database.models)