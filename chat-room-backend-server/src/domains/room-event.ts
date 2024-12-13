import z from 'zod';

export const roomEventSchema = z.object({
  content: z.record(z.unknown()),
  event_id: z.string(),
  origin_server_ts: z.number(),
  room_id: z.string(),
  sender: z.string(),
  type: z.string(),
  state_key: z.string().optional(),
  unsigned: z.object({
    age: z.number().optional(),
    membership: z.string().optional(),
    prev_content: z.record(z.unknown()).optional(),
    redacted_because: z.string().optional().describe('RoomEvent'),
    transaction_id: z.string().optional(),
  }),
});

export const roomStrippedEventSchema = roomEventSchema
  .pick({
    content: true,
    sender: true,
    type: true,
  })
  .merge(
    z.object({
      state_key: z.string(),
    }),
  );

export type RoomStrippedEvent = z.infer<typeof roomStrippedEventSchema>;
