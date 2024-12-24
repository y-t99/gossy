import { RoomVersion } from '../../enums';
import {
  roomCreateContentSchema,
  roomPowerLevelsContentSchema,
  invite3pidSchema,
  stateEventSchema,
} from '../../domains';
import { z } from 'zod';

export const createRoomRoSchema = z.object({
  creation_content: roomCreateContentSchema
    .omit({
      creator: true,
      room_version: true,
    })
    .partial()
    .optional(),
  initial_state: z.array(stateEventSchema).optional(),
  invite: z.array(z.string()).optional(),
  invite_3pid: z.array(invite3pidSchema).optional(),
  is_direct: z.boolean().optional(),
  name: z.string().optional(),
  power_level_content_override: roomPowerLevelsContentSchema.optional(),
  preset: z
    .enum(['private_chat', 'public_chat', 'trusted_private_chat'])
    .optional(),
  room_alias_name: z.string().optional(),
  room_version: z.nativeEnum(RoomVersion).optional(),
  topic: z.string().optional(),
  visibility: z.enum(['public', 'private']).optional(),
});

export type CreateRoomRo = z.infer<typeof createRoomRoSchema>;
