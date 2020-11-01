import express from 'express';
import { querySpans } from './query-spans';
import { getSpanById } from './get-span';

const spansRouter = express.Router();

spansRouter.post('/query', querySpans);
spansRouter.get('/:id', getSpanById);

export { spansRouter };
