import { HistoryVisibilityEnum } from '../../enums';
import { z } from 'zod';

export const historyVisibilityContentSchema = z.object({
  history_visibility: z.nativeEnum(HistoryVisibilityEnum),
});

export type HistoryVisibilityContent = z.infer<
  typeof historyVisibilityContentSchema
>;
