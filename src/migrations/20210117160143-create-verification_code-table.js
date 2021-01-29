'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable('verification_codes', {
      number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 5,
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
    CREATE EVENT expireCode
    ON SCHEDULE
    EVERY 30 MINUTE
    DO
    DELETE FROM verification_codes WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 MINUTE);
    `)
  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.dropTable('verification_codes');
    

    await queryInterface.sequelize.query(`
    DROP EVENT expireCode
    `)
  }
};
