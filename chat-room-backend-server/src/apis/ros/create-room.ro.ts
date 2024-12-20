import { invite3pidSchema, stateEventSchema } from '../../domains';
import {
  roomCreateContentSchema,
  roomPowerLevelsContentSchema,
} from '../../domains/event-content';
import { z } from 'zod';

export const createRoomRoSchema = z.object({
  creation_content: roomCreateContentSchema
    .pick({
      'm.federate': true,
      creator: true,
      room_version: true,
    })
    .partial()
    .optional(),
  initial_state: stateEventSchema.optional(),
  invite: z.array(z.string()).optional(),
  invite_3pid: z.array(invite3pidSchema).optional(),
  id_direct: z.boolean().optional(),
  name: z.string().optional(),
  power_level_content_override: roomPowerLevelsContentSchema.optional(),
  preset: z
    .enum(['private_chat', 'public_chat', 'trusted_private_chat'])
    .optional(),
  room_alias_name: z.string().optional(),
  room_version: z.number().optional(),
  topic: z.string().optional(),
  visibility: z.enum(['public', 'private']).optional(),
});
