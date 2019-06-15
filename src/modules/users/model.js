const { sequelize, Sequelize } = require('../../lib/bootstrap/database');

const User = sequelize.define(
  'User',
  {
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
  },
  {
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      {
        name: 'name',
        unique: true,
        fields: ['name'],
      },
      {
        name: 'is_occupied',
        unique: true,
        fields: ['is_occupied'],
      },
    ],
  }
);

module.exports = User;
