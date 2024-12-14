/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#identifier-types
 */
export enum Identifier {
  USER = 'm.id.user',
  ROOM = 'm.id.room',
  EVENT = 'm.id.event',
  ROOM_ALIAS = 'm.id.room_alias',
  THIRDPARTY = 'm.id.thirdparty',
  PHONE = 'm.id.phone',
  DEVICE = 'm.id.device',
}
