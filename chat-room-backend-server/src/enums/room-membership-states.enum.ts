/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#mroommember
 */
export enum RoomMembershipStates {
  INVITE = 'invite',
  JOIN = 'join',
  LEAVE = 'leave',
  BAN = 'ban',
  KNOCK = 'knock',
}
