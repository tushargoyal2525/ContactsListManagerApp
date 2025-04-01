/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("contacts", function (table) {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email").notNullable().unique();
      });

  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("contacts");
  
};
