const sequelize = require('../config/config'); // Import the Sequelize instance
const Admin = require('./admin');
const User = require('./user');
const Movies = require('./movies');
const Series = require('./series');

// Synchronize models with the database
(async () => {
    await sequelize.sync();
})();

module.exports = {
    Admin,
    User,
    Movies,
    Series,
    sequelize
};
