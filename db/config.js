const knexConfig = require('./knexfile');

// Initialize knex

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];
const db = require("knex")(config)

const USERS_TABLE_NAME = "users_account";
const USERS_WALLET_TABLE_NAME = "wallets";

module.exports = { USERS_TABLE_NAME, USERS_WALLET_TABLE_NAME, db };