export interface Span {
  spanId: string;
  parentSpanId: string;
  operationName: string;
  references: [];
  startTime: number;
  duration: number;
  tags: SpanField[];
  logs: SpanLog[];
}

export interface SpanField {
  key: string;
  vStr?: string;
  vDouble?: number;
  vLong?: number;
  vBool?: 0 | 1;
  vType?: 0;
}

export interface SpanLog {
  timestamp: number;
  fields: SpanField[];
}

export interface SpanRow {
  id: string;
  parent_id: string | null;
  operation_name: string;
  start_time: string;
  duration: number;
  original: string;
}

export interface TagRow extends RowValue {
  id: string;
  span_id: string;
  key: string;
}

export interface LogRow extends RowValue {
  id: string;
  span_id: string;
  timestamp: string;
  key: string;
}

export interface RowValue {
  string_value: string | null;
  numeric_value: number | null;
  boolean_value: boolean | null;
}
