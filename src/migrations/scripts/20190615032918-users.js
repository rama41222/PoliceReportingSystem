'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        is_occupied: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
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
            name: 'name',
            unique: false,
            fields: ['name'],
          },
          {
            name: 'is_occupied',
            unique: false,
            fields: ['is_occupied'],
          },
        ],
      },
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  },
};
