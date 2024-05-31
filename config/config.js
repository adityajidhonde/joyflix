const Sequelize = require("sequelize-cockroachdb");


// Configure CockroachDB
const sequelize = new Sequelize({
    dialect: "postgres",
    username: "aditya",
    password: "doWe83efYdFU-dl8nyPRPA",
    host: "aditya-joyflix-14560.7tt.aws-us-east-1.cockroachlabs.cloud",
    port: 26257,
    database: "joyflix",
    dialectOptions: {
        ssl: {},
        encrypt: {
            encrypt: "true"
        }
    },
    logging: false,
});





// Sync tables



sequelize.authenticate()
    .then(() => console.log('Database connection established successfully.'))
    .catch((error) => console.error('Unable to connect to the database:', error));

module.exports = sequelize;