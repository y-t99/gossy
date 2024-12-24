import { RoomStateEventType } from '../enums';
import { roomEventSchema } from './room-event';
import { z } from 'zod';

export const stateEventSchema = roomEventSchema
  .pick({
    content: true,
    state_key: true,
  })
  .merge(z.object({ type: z.nativeEnum(RoomStateEventType) }));
