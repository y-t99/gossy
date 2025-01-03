export const RoomVersion = {
  V1: 'V1',
  V2: 'V2',
  V3: 'V3',
  V4: 'V4',
  V5: 'V5',
  V6: 'V6',
  V7: 'V7',
  V8: 'V8',
  V9: 'V9',
  V10: 'V10',
  V11: 'V11',
} as const;

export type RoomVersion = (typeof RoomVersion)[keyof typeof RoomVersion];
