const { sequelize, Sequelize } = require('../../lib/bootstrap/database');

const User = sequelize.define('Users', {
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

module.exports = User;
