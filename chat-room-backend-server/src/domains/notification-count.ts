import { z } from 'zod';

export const notificationCountSchema = z.object({
  highlight_count: z.number().optional(),
  notification_count: z.number().optional(),
});

export type NotificationCount = z.infer<typeof notificationCountSchema>;
