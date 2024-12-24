/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#mroomjoin_rules
 */
export const RoomJoinRules = {
  PUBLIC: 'PUBLIC',
  INVITE: 'INVITE',
  KNOCK: 'KNOCK',
  RESTRICTED: 'RESTRICTED',
  KNOCK_RESTRICTED: 'KNOCK_RESTRICTED',
  PRIVATE: 'PRIVATE',
} as const;

export type RoomJoinRules = (typeof RoomJoinRules)[keyof typeof RoomJoinRules];
