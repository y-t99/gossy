import { RoomJoinRules } from '../../enums';
import { z } from 'zod';

export const roomJoinRulesContentSchema = z.object({
  allow: z
    .array(
      z.object({
        room_id: z
          .string()
          .describe(
            'Required if type is m.room_membership. The room ID to check the user’s membership against. If the user is joined to this room, they satisfy the condition and thus are permitted to join the restricted room.',
          ),
        type: z.literal('m.room_membership'),
      }),
    )
    .describe(
      'For restricted rooms, the conditions the user will be tested against. The user needs only to satisfy one of the conditions to join the restricted room. If the user fails to meet any condition, or the condition is unable to be confirmed as satisfied, then the user requires an invite to join the room. Improper or no allow conditions on a restricted join rule imply the room is effectively invite-only (no conditions can be satisfied).',
    ),
  join_rule: z.nativeEnum(RoomJoinRules),
});
