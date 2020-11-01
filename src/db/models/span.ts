import { Model, RelationMappings } from 'objection';
import { TagModel } from './tag';
import { LogModel } from './log';

export class SpanModel extends Model {
  static tableName = 'span';

  static relationMappings = (): RelationMappings => ({
    tags: {
      relation: Model.HasManyRelation,
      modelClass: TagModel,
      join: {
        from: 'span.id',
        to: 'tag.span_id',
      },
    },
    logs: {
      relation: Model.HasManyRelation,
      modelClass: LogModel,
      join: {
        from: 'span.id',
        to: 'log.span_id',
      },
    },
  });
}
