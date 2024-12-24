import { GuestAccess } from '../../enums';
import { z } from 'zod';

export const guestAccessContentSchema = z.object({
  guest_access: z.nativeEnum(GuestAccess).optional(),
});

export type GuestAccessContent = z.infer<typeof guestAccessContentSchema>;
