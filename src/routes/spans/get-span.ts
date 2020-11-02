import { QueryBuilder, raw } from 'objection';
import { SpanModel } from '../../db/models/span';
import { Request, RequestHandler } from 'express';

export const getSpanById: RequestHandler = async (req, res, next) => {
  try {
    const spanQuery = buildQuery(req);
    const [span] = await spanQuery;
    res.send({ span });
  } catch (error) {
    next(error);
  }
};

function buildQuery(req: Request): QueryBuilder<SpanModel> {
  return SpanModel.query()
    .withGraphJoined('[tags,logs]')
    .modifyGraph('tags', (graphBuilder) => {
      graphBuilder.select([
        'key',
        raw('coalesce(??, ??::varchar, ??::varchar) as ??', [
          'string_value',
          'numeric_value',
          'boolean_value',
          'value',
        ]),
      ]);
    })
    .modifyGraph('logs', (graphBuilder) => {
      graphBuilder.select([
        'timestamp',
        'key',
        raw('coalesce(??, ??::varchar, ??::varchar) as ??', [
          'string_value',
          'numeric_value',
          'boolean_value',
          'value',
        ]),
      ]);
    })
    .select([
      'span.id as spanId',
      'parent_id as parentSpanId',
      'operation_name as operationName',
      'start_time as startTime',
      'duration',
      'tags.value as tags:value',
      'logs.value as logs:value',
    ])
    .where('span.id', req.params.id);
}
