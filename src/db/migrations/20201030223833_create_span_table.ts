import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('span', (table: Knex.TableBuilder) => {
    table.string('id').notNullable().primary();
    table.string('parent_id').references('span.id');
    table.string('operation_name').notNullable();
    table.timestamp('start_time').notNullable();
    table.integer('duration').notNullable();
    table.jsonb('original').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('span');
}
