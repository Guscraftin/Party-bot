const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Party = require('./models/party.js')(sequelize, Sequelize.DataTypes);

module.exports = { Party, sequelize };