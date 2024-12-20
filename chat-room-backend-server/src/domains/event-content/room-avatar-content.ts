import { z } from 'zod';

import { avatarInfoSchema } from '../resource';

export const roomAvatarContentSchema = z.object({
  info: avatarInfoSchema.optional(),
  url: z.string().url().optional(),
});

export type RoomAvatarContent = z.infer<typeof roomAvatarContentSchema>;
