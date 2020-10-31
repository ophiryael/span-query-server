import { dbKnex } from './db/connection';
import { ingestSpans } from './db/spans-ingestor';

async function main(): Promise<void> {
  console.log('Initializing server...');
  try {
    await runDbTasks();
  } catch (err) {
    console.log('Failed to run server', err);
  }
}

async function runDbTasks(): Promise<void> {
  await dbKnex.migrate.latest();
  const isSeeded = await isDbSeeded();
  if (!isSeeded) {
    await ingestSpans();
  }
}

async function isDbSeeded(): Promise<boolean> {
  const [isSeeded] = await dbKnex('span').select(1).limit(1);
  return Boolean(isSeeded);
}

main();
