import { z } from 'zod';

const publicKeys = z.object({
  key_validity_url: z.string().optional(),
  public_key: z.string(),
});

export const roomThirdPartyInviteContentSchema = z.object({
  display_name: z.string(),
  key_validity_url: z.string(),
  public_key: z.string(),
  public_keys: z.array(publicKeys).optional(),
});

export type RoomThirdPartyInviteContent = z.infer<
  typeof roomThirdPartyInviteContentSchema
>;
