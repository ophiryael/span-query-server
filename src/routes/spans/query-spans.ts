import { RequestHandler, Request } from 'express';
import { QueryBuilder } from 'objection';
import {
  SpanQuery,
  Condition,
  Dictionary,
  DbValueColumn,
  ClauseAdderMap,
  ConditionRelation,
} from './interfaces';
import { SpanModel } from '../../db/models/span';

export const querySpans: RequestHandler = async (req, res, next) => {
  try {
    const spanQuery = buildQuery(req);
    res.send({ spans: await spanQuery });
  } catch (error) {
    next(error);
  }
};

function buildQuery(req: Request) {
  const query = createBaseQuery(req.body.limit);
  buildQueryLevel(query, req.body.query);
  return query;
}

function createBaseQuery(limit: number): QueryBuilder<SpanModel> {
  return SpanModel.query()
    .leftJoinRelated('[tags,logs]')
    .distinct('span.id as spanId')
    .select(['operation_name as operationName', 'start_time as startTime', 'duration as duration'])
    .orderBy('start_time', 'desc')
    .limit(limit);
}

function buildQueryLevel(query: QueryBuilder<SpanModel>, queryLevel: SpanQuery): void {
  const { relation, conditions } = queryLevel;
  for (const condition of conditions) {
    addCondition(query, relation, condition);
  }
}

// function validateRelation(relation: unknown): ConditionRelation | never {
//   if (typeof relation !== 'string' || !['and', 'or'].includes(relation)) {
//     throw new Error('Invalid query relation');
//   }
//   return relation as ConditionRelation;
// }

// function validateConditions(conditions: unknown): Condition[] | never {
//   if (!Array.isArray(conditions)) {
//     throw new Error('Invalid query conditions');
//   }
//   return conditions.map(validateQueryCondition);
// }

// function validateQueryCondition(condition: unknown): Condition | never {
//   if (typeof condition !== 'object' || condition === null) {
//     throw new Error('Invalid condition');
//   }
//   // TODO: add validation for condition fields
//   return condition as Condition;
// }

function addCondition(
  query: QueryBuilder<SpanModel>,
  relation: ConditionRelation,
  condition: Condition
): void {
  const whereClause = relation === 'and' ? 'andWhere' : 'orWhere';
  query[whereClause]((subQueryBuilder) => {
    addQueryFilters(subQueryBuilder, condition);
    if (condition.subQuery) {
      buildQueryLevel(subQueryBuilder, condition.subQuery);
    }
  });
}

const operatorToClauseAdder: ClauseAdderMap = {
  equals: (query, column, value) => query.where(column, value as string | number),
  greaterThan: (query, column, value) => query.where(column, '>', value as number),
  lessThan: (query, column, value) => query.where(column, '<', value as number),
  isTrue: (query, column) => query.where(column, true),
  isFalse: (query, column) => query.where(column, false),
};

function addQueryFilters(query: QueryBuilder<SpanModel>, condition: Condition): void {
  const addClause = operatorToClauseAdder[condition.operator];
  const valueColumn = getValueColumn(condition);

  if (condition.type === 'span') {
    addClause(query, valueColumn, condition.value);
  } else {
    query.where((builder) => {
      builder.where(`${condition.type}s.key`, condition.field);
      addClause(builder, `${condition.type}s.${valueColumn}`, condition.value);
    });
  }
}

const spanFieldToDbColumn: Dictionary<string> = {
  spanId: 'span.id',
  parentSpanId: 'parent_id',
  operationName: 'operation_name',
  startTime: 'start_time',
  duration: 'duration',
};

const operatorToValueColumn: Dictionary<DbValueColumn> = {
  equals: 'string_value',
  greaterThan: 'numeric_value',
  lessThan: 'numeric_value',
  isTrue: 'boolean_value',
  isFalse: 'boolean_value',
};

function getValueColumn(condition: Condition): string {
  if (condition.type === 'span') {
    return spanFieldToDbColumn[condition.field];
  }
  return operatorToValueColumn[condition.operator];
}
