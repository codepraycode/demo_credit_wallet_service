const { USERS_TABLE_NAME, USERS_WALLET_TABLE_NAME, USERS_TRANSACTION_TABLE_NAME } = require('../config');

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
        table.timestamps(); // created_at and updated_at
        table.boolean("deleted").defaultTo(false) // deleted flag

    })

        .createTable(USERS_WALLET_TABLE_NAME, function (table) {
            table.increments("id");

            table.string("walletID").unique().notNullable();
            table
                .integer('user_id')
                .unsigned()
                .index()
                .references(USERS_TABLE_NAME +'.id')
                .onDelete('CASCADE');
            table.float("balance").defaultTo(0.00);
            // Meta data
            table.timestamps(true, true); // created_at and updated_at
            table.boolean("deleted").defaultTo(false) // deleted flag
        })

        .createTable(USERS_TRANSACTION_TABLE_NAME, function (table) {
            table.increments("id");

            table.string("description").notNullable();
            table.string("transaction_type").notNullable();
            table.dateTime("transation_date").notNullable();
            
            table
                .integer('user_id')
                .unsigned()
                .index()
                .references(USERS_TABLE_NAME +'.id')
                .onDelete('CASCADE');
            
            table
                .integer('wallet_id')
                .unsigned()
                // .index()
                .references(USERS_WALLET_TABLE_NAME +'.id')
                .onDelete('CASCADE');
            
            table.float("amount").notNullable();
            // Meta data
            table.timestamp("created_at"); // created_at
            table.boolean("deleted").defaultTo(false) // deleted flag
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

    knex.schema.table(USERS_WALLET_TABLE_NAME, (table)=>{
        table.dropForeign('user_id')
    }).catch((err)=>console.error(err));
    
    knex.schema.table(USERS_TRANSACTION_TABLE_NAME, (table)=>{
        table.dropForeign('user_id')
        table.dropForeign('wallet_id')
    }).catch((err)=>console.error(err));

    
    return knex.schema.dropTableIfExists(USERS_TABLE_NAME)
            .dropTableIfExists(USERS_WALLET_TABLE_NAME)
            .dropTableIfExists(USERS_TRANSACTION_TABLE_NAME)
            
};
