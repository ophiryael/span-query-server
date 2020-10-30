import Knex from 'knex';
import path from 'path';

function createConfig() {
  return {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    migrations: {
      tableName: 'knex_migrations',
      directory: getMigrationsDir(),
      extension: 'ts',
    },
    seeds: {
      directory: getSeedsDir(),
      extension: 'ts',
    },
  };
}

function getMigrationsDir(): string {
  return path.join(__dirname, 'migrations');
}

function getSeedsDir(): string {
  return path.join(__dirname, 'seeds');
}

export const dbKnex: Knex = Knex(createConfig());
