import { QueryBuilder } from 'objection';
import { SpanModel } from '../../db/models/span';

export interface Dictionary<T> {
  [key: string]: T;
}

export interface SpanQuery {
  relation: ConditionRelation;
  conditions: Condition[];
}

export type ConditionRelation = 'and' | 'or';

export type Condition = SpanCondition | TagOrLogCondition;

interface SpanCondition extends BaseCondition {
  type: 'span';
  field: 'spanId' | 'parentSpanId' | 'operationName' | 'startTime' | 'duration';
}

interface TagOrLogCondition extends BaseCondition {
  type: 'tag' | 'log';
  field: string;
}

interface BaseCondition {
  operator: 'equals' | 'greaterThan' | 'lessThan' | 'isTrue' | 'isFalse';
  value?: string | number;
  subQuery: SpanQuery;
}

export type ClauseAdderMap = { [key in Condition['operator']]: ClauseCreator };

type ClauseCreator = (
  query: QueryBuilder<SpanModel>,
  column: string,
  value: BaseCondition['value']
) => void;

export type DbValueColumn = 'string_value' | 'numeric_value' | 'boolean_value';
