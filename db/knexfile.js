// Update with your config settings.
require("dotenv").config();
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const Host = process.env.DB_HOST;
const Port = process.env.DB_PORT;
const User = process.env.DB_USER;
const Password = process.env.DB_PASSWORD;
const Database = process.env.DB_NAME;

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: Host,
      port: Port,
      user: User,
      password: Password,
      database: Database,
    },
    migrations: {
      tableName: 'knex_migrations'
    },
  },

  staging: {
    client: 'mysql2',
    connection: {
      host: Host,
      port: Port,
      user: User,
      password: Password,
      database: Database
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: Host,
      // port: Port,
      user: User,
      password: Password,
      database: Database
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
