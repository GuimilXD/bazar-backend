const { Model, DataTypes } = require("sequelize")


class VerificationCode extends Model {
    static init(connection) {
        super.init({
            number: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
                unique: {
                    msg: "SMS was already sent."
                },
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false
            },
            attempts: {
                type: DataTypes.INTEGER,
                defaultValue: 5,
            },
        }, {
            sequelize: connection
        })
    }
}

module.exports = VerificationCode