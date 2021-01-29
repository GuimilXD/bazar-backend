'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      cep: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    
    await queryInterface.sequelize.query(`    
    CREATE EVENT removeNonVerifiedAccounts
    ON SCHEDULE
    EVERY 1 DAY
    DO
    DELETE FROM users WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 DAY) AND verified = FALSE;
    `)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');

    await queryInterface.sequelize.query(`
    DROP EVENT removeNonVerifiedAccounts
    `)
  }
};
