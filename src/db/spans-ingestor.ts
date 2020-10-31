import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dbKnex } from './connection';
import { Span, SpanRow, TagRow, LogRow, SpanField, SpanLog, RowValue } from './interfaces';

export async function ingestSpans(): Promise<void> {
  const spans = readAndFormatSpans();
  const seedRows = getSeedRows(spans);

  await dbKnex.transaction(async (trx) => {
    await trx('span').insert(seedRows.spans);
    await trx('tag').insert(seedRows.tags);
    await trx('log').insert(seedRows.logs);
  });
}

function readAndFormatSpans(): Span[] {
  const spansFilepath = path.join(__dirname, 'spans.json');
  const spansContent = fs.readFileSync(spansFilepath, 'utf8');

  // replace long ids with strings to avoid js floating point issues
  const formattedSpans = spansContent
    .replace(/"spanId": (-?\d+),/g, '"spanId": "$1",')
    .replace(/"parentSpanId": (-?\d+),/g, '"parentSpanId": "$1",');

  return JSON.parse(formattedSpans);
}

interface SeedRows {
  spans: SpanRow[];
  tags: TagRow[];
  logs: LogRow[];
}

function getSeedRows(spans: Span[]): SeedRows {
  return spans.reduce<SeedRows>(
    (seedRows, span) => {
      const { spans, tags, logs } = seedRows;
      spans.push(getSpanRow(span));
      tags.push(...getTagRows(span.tags, span.spanId));
      logs.push(...getLogRows(span.logs, span.spanId));
      return seedRows;
    },
    { spans: [], tags: [], logs: [] }
  );
}

function getSpanRow(span: Span): SpanRow {
  return {
    id: span.spanId,
    parent_id: getSpanParentId(span.parentSpanId),
    operation_name: span.operationName,
    start_time: getSpanTimestampISOString(span.startTime),
    duration: getSpanDurationInMs(span.duration),
    original: JSON.stringify(span),
  };
}

function getSpanParentId(parentId: string): string | null {
  return parentId !== '0' ? parentId : null;
}

function getSpanTimestampISOString(timestamp: number): string {
  return new Date(timestamp / 1000).toISOString();
}

function getSpanDurationInMs(duration: number): number {
  return Number(duration.toString().slice(1));
}

function getTagRows(tags: SpanField[], spanId: string): TagRow[] {
  return tags.map((tag) => ({
    id: uuidv4(),
    span_id: spanId,
    key: tag.key,
    ...formatFieldsAsRowValues(tag),
  }));
}

function getLogRows(logs: SpanLog[], spanId: string): LogRow[] {
  return logs.reduce<LogRow[]>((logRows, log) => {
    const timestamp = getSpanTimestampISOString(log.timestamp);
    log.fields.forEach((field) => {
      logRows.push({
        id: uuidv4(),
        span_id: spanId,
        timestamp,
        key: field.key,
        ...formatFieldsAsRowValues(field),
      });
    });
    return logRows;
  }, []);
}

function formatFieldsAsRowValues(fields: SpanField): RowValue {
  const { vStr, vDouble, vLong, vBool } = fields;
  return {
    string_value: vStr ?? null,
    numeric_value: vDouble ?? vLong ?? null,
    boolean_value: vBool ? Boolean(vBool) : null,
  };
}
