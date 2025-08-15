/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {

  await knex.schema.createTable('agentes', (table) => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.date('dataDeIncorporacao').notNullable();
    table.string('cargo').notNullable();
  });

  await knex.schema.createTable('casos', (table) => {
    table.increments('id').primary();
    table.string('titulo').notNullable();
    table.text('descricao').notNullable();

    table.enu('status', ['aberto', 'solucionado'])
        .notNullable()
        .defaultTo('aberto');

    table.integer('agente_id')
        .notNullable()
        .references('id')
        .inTable('agentes')
        .onDelete('CASCADE');

    table.index(['agente_id']);

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('casos');
    await knex.schema.dropTableIfExists('agentes');
};
