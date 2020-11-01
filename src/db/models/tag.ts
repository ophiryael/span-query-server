import { Model, RelationMappings } from 'objection';
import { SpanModel } from './span';

export class TagModel extends Model {
  static tableName = 'tag';

  static relationMappings = (): RelationMappings => ({
    span: {
      relation: Model.BelongsToOneRelation,
      modelClass: SpanModel,
      join: {
        from: 'tag.span_id',
        to: 'span.id',
      },
    },
  });
}
