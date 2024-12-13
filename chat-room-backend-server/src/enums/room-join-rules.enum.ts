/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#mroomjoin_rules
 */
export enum RoomJoinRules {
  PUBLIC = 'public',
  INVITE = 'invite',
  KNOCK = 'knock',
  RESTRICTED = 'restricted',
  KNOCK_RESTRICTED = 'knock_restricted',
  PRIVATE = 'private',
}
