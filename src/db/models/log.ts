import { Model, RelationMappings } from 'objection';
import { SpanModel } from './span';

export class LogModel extends Model {
  static tableName = 'log';

  static relationMappings = (): RelationMappings => ({
    span: {
      relation: Model.BelongsToOneRelation,
      modelClass: SpanModel,
      join: {
        from: 'log.span_id',
        to: 'span.id',
      },
    },
  });
}
