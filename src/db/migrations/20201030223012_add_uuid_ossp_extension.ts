import Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('create extension if not exists "uuid-ossp"');
}

export async function down(): Promise<void> {
  // Never uninstall extension, we don't know who created it
}
