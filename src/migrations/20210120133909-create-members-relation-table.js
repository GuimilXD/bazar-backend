'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('servers_members', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        allowNull: false,
        autoIncrement: true,
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
      user_id: {
          type: Sequelize.INTEGER,
          references: {
              model: "users", key: "id"
          },
          allowNull: true,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
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
   
    await queryInterface.dropTable('servers_members');
     
  }
};
