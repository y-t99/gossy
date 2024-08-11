import { z } from 'zod';
import { ErrcodeEnum } from '../enums';

export const StandardErrorResponseSchema = z.object({
  errcode: z.nativeEnum(ErrcodeEnum),
  error: z.string(),
});

export type StandardErrorResponse = z.infer<typeof StandardErrorResponseSchema>;
