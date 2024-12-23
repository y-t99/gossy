import { GuestAccessEnum } from '../../enums';
import { z } from 'zod';

export const guestAccessContentSchema = z.object({
  guest_access: z.nativeEnum(GuestAccessEnum).optional(),
});

export type GuestAccessContent = z.infer<typeof guestAccessContentSchema>;
