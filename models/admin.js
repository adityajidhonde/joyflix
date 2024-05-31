const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Adjust the path to your database configuration

const Admin = sequelize.define('Admin', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Admin;
