import { HistoryVisibility } from '../../enums';
import { z } from 'zod';

export const historyVisibilityContentSchema = z.object({
  history_visibility: z.nativeEnum(HistoryVisibility),
});

export type HistoryVisibilityContent = z.infer<
  typeof historyVisibilityContentSchema
>;
