const { sequelize, Sequelize } = require('../../lib/bootstrap/database');
const User = require('./../users/model');

const Report = sequelize.define(
  'Report',
  {
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
      allowNull: false,
    },
  },
  {
    createdAt: 'created',
    updatedAt: 'modified',
    indexes: [
      {
        name: 'reg_number',
        unique: true,
        fields: ['reg_number'],
      },
    ],
  }
);
Report.belongsTo(User, { foreignKey: 'assignee_id', targetKey: 'id', as: 'assigned_police_officer' });
module.exports = Report;
