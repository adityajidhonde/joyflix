const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Adjust the path to your database configuration

const Series = sequelize.define("series", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.TEXT, defaultValue: "noName" },
    link: { type: Sequelize.TEXT, defaultValue: "https://youtu.be/4YKpBYo61Cs" },
    genre: { type: Sequelize.TEXT, defaultValue: "Unknown" },
    release_date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    no_of_episodes: { type: Sequelize.INTEGER, defaultValue: 0 },
    description: { type: Sequelize.TEXT, defaultValue: "Unknown" },
    trailor_link: { type: Sequelize.TEXT, defaultValue: "https://youtu.be/4YKpBYo61Cs" },
    cast: { type: Sequelize.TEXT, defaultValue: "Unknown" },
    type_of: { type: Sequelize.TEXT, defaultValue: "Unknown" },
    likes: { type: Sequelize.INTEGER, defaultValue: 0 }
});

Series.sync({ alter: true }) // Use alter: true to update the table structure without dropping it
    .then(() => {
        console.log('Series table synchronized successfully.');
    })
    .catch((error) => {
        console.error('Error synchronizing Series table:', error);
    });
module.exports = Series;
