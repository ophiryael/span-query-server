import Knex from 'knex';
import path from 'path';

function createConfig() {
  return {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    migrations: {
      tableName: 'knex_migrations',
      directory: getMigrationsDir(),
    },
  };
}

function getMigrationsDir(): string {
  return path.join(__dirname, 'migrations');
}

export const dbKnex: Knex = Knex(createConfig());
