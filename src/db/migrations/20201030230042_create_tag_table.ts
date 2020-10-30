import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tag', (table: Knex.TableBuilder) => {
    table.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('span_id').notNullable().references('span.id');
    table.string('key').notNullable();
    table.string('string_value');
    table.decimal('numeric_value');
    table.boolean('boolean_value');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tag');
}
