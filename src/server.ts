import express from 'express';
import { spansRouter } from './routes/spans';

export function runServer(): void {
  const app = express();
  app.use(express.json());

  app.use('/spans', spansRouter);

  const port = Number(process.env.SERVER_PORT);
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}
