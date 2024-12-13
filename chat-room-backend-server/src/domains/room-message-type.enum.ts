/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#mroommessage-msgtypes
 */
export enum RoomMessageType {
  TEXT = 'm.text',
  EMOTE = 'm.emote',
  NOTICE = 'm.notice',
  IMAGE = 'm.image',
  FILE = 'm.file',
  AUDIO = 'm.audio',
  VIDEO = 'm.video',
  LOCATION = 'm.location',
}
