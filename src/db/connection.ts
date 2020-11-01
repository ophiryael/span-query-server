import Knex from 'knex';
import path from 'path';
import { Model } from 'objection';

function createConfig() {
  return {
    client: 'pg',
    connection: process.env.DB_CONNECTION_STRING,
    migrations: {
      tableName: 'knex_migrations',
      directory: getMigrationsDir(),
      extension: 'ts',
    },
  };
}

function getMigrationsDir(): string {
  return path.join(__dirname, 'migrations');
}

export const dbKnex: Knex = Knex(createConfig());

Model.knex(dbKnex);
