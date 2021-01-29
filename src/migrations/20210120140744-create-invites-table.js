'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('invites', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true,
      },
      inviter_id: {
        type: Sequelize.INTEGER,
        references: {
            model: "users", key: "id"
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      server_id: {
        type: Sequelize.INTEGER,
        references: {
            model: "servers", key: "id"
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
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
    
    await queryInterface.dropTable('invites');
     
  }
};
