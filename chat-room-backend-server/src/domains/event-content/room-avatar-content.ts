import { z } from 'zod';

import { thumbnailInfoSchema } from '../resource';

export const roomAvatarContentSchema = z.object({
  info: z
    .object({
      mimetype: z.string().optional(),
      size: z.number().optional(),
      h: z.number().optional(),
      w: z.number().optional(),
      thumbnail_info: thumbnailInfoSchema.optional(),
      thumbnail_url: z.string().url().optional(),
    })
    .optional(),
  url: z.string().url().optional(),
});
