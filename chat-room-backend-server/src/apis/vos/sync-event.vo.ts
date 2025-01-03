import { timelineSchema } from 'src/domains/timeline';
import {
  customEventSchema,
  notificationCountSchema,
  roomEventWithoutRoomIdSchema,
  roomStrippedEventSchema,
  roomSummarySchema,
} from '../../domains';
import { z } from 'zod';

export const syncEventVoSchema = z.object({
  account_data: z
    .object({
      events: z.array(customEventSchema),
    })
    .optional(),
  device_lists: z
    .object({
      changed: z.array(z.string()),
      left: z.array(z.string()),
    })
    .optional(),
  device_one_time_keys_count: z.record(z.number()).optional(),
  next_batch: z.string(),
  presence: z
    .object({
      events: z.array(
        z.object({
          type: z.string(),
          contents: z.record(z.unknown()),
        }),
      ),
    })
    .optional(),
  rooms: z
    .object({
      invite: z
        .record(
          z.object({
            invite_state: z.object({
              events: z.array(roomStrippedEventSchema),
            }),
          }),
        )
        .optional(),
      join: z
        .record(
          z.object({
            account_data: z
              .object({
                events: z.array(customEventSchema),
              })
              .optional(),
            ephemeral: z
              .object({
                events: z.array(customEventSchema),
              })
              .optional(),
            state: z
              .object({
                events: z.array(roomEventWithoutRoomIdSchema),
              })
              .optional(),
            summary: roomSummarySchema.optional(),
            timeline: timelineSchema.optional(),
            unread_notifications: notificationCountSchema.optional(),
            unread_thread_notifications: z
              .record(notificationCountSchema)
              .optional(),
          }),
        )
        .optional(),
      leave: z
        .record(
          z.object({
            account_data: z
              .object({
                events: z.array(customEventSchema),
              })
              .optional(),
            timeline: timelineSchema.optional(),
            state: z
              .object({
                events: z.array(roomEventWithoutRoomIdSchema),
              })
              .optional(),
          }),
        )
        .optional(),
      kicked: z
        .record(
          z.object({
            knock_state: z
              .object({
                events: z.array(roomStrippedEventSchema).optional(),
              })
              .optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  to_device: z
    .object({
      events: z.array(roomStrippedEventSchema.omit({ state_key: true })),
    })
    .optional(),
});

export type SyncEventVo = z.infer<typeof syncEventVoSchema>;
