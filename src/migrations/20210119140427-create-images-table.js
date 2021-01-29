'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      server_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "servers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      avatar_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
     
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.dropTable('images');
     
  }
};
