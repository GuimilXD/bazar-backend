'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("products", "server_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "servers", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("products", "server_id")
  }
};
