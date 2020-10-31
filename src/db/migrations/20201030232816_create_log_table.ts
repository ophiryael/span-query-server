import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('log', (table: Knex.TableBuilder) => {
    table.uuid('id').notNullable().primary();
    table.string('span_id').notNullable().references('span.id');
    table.timestamp('timestamp').notNullable();
    table.string('key').notNullable();
    table.string('string_value');
    table.decimal('numeric_value');
    table.boolean('boolean_value');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('log');
}
