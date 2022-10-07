const { USERS_TABLE_NAME, USERS_WALLET_TABLE_NAME } = require('../config');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable(USERS_TABLE_NAME, function (table) {
        table.increments("id");
        table.string("firstname", 200).notNullable();
        table.string("lastname", 200).notNullable();
        table.string("phonenumber", 100).notNullable();
        table.string("email", 255).notNullable();
        table.string("password", 200).notNullable();

        // Meta data
        // table.timestamp("created_at").defaultTo(knex.fn.now());
        // table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.timestamps(); // created_at and updated_at

    })

        .createTable(USERS_WALLET_TABLE_NAME, function (table) {
            table.increments("id");

            table.string("walletID").unique().notNullable();
            table
                .integer('user_id')
                .unsigned()
                .index()
                .references(USERS_WALLET_TABLE_NAME+'.id')
                // .inTable(USERS_TABLE_NAME)
                .onDelete('SET NULL');
            table.float("balance").defaultTo(0.00);
            // Meta data
            // table.timestamp("created_at").defaultTo(knex.fn.now());
            // table.timestamp("updated_at").defaultTo(knex.fn.now());
            table.timestamps(true, true); // created_at and updated_at
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists(USERS_TABLE_NAME).dropTableIfExists(USERS_WALLET_TABLE_NAME);
};
