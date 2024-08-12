import { Schema } from 'zod';

export interface PipeSchema {
  path?: Schema;
  query?: Schema;
  body?: Schema;
}
