'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reports', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        owner: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        reg_number: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        color: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        stolen_date: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        assignee_id: {
          type: Sequelize.BIGINT,
          references: {
            model: 'Users',
            key: 'id',
          },
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('RESOLVED', 'PENDING','UNRESOLVED'),
          defaultValue: 'UNRESOLVED'
        },
        created: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
        },
        modified: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
          onUpdate: 'CURRENT_TIMESTAMP'
        }
      },
      {
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'modified',
        indexes: [
          {
            name: 'reg_number',
            unique: false,
            fields: ['reg_number'],
          },
        ],
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Reports');
  }
};
