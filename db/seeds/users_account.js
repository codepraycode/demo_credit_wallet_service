const { USERS_TABLE_NAME } = require('../config');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex(USERS_TABLE_NAME).del()
  await knex(USERS_TABLE_NAME).insert([
    {
      id: 1,
      firstname: 'Lorem',
      lastname: "Ipsum",
      phonenumber: "+234 8000000",
      email: "mail@sample.com",
      password: "letmein"
    },
  ]);
};
