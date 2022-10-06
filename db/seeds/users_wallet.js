const { USERS_WALLET_TABLE_NAME } = require('../config');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex(USERS_WALLET_TABLE_NAME).del()
  await knex(USERS_WALLET_TABLE_NAME).insert([
    {
      id: 1,
      walletId: '12asdf;wekrlw;lwekkeklwkekkjwkeklwe',
      balance: 0.00,
    },
  ]);
};
