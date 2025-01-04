/// @see https://spec.matrix.org/v1.12/appendices/#common-identifier-format

import { Identifier } from '../enums';
import { customAlphabet } from 'nanoid';

const customIdGenerator = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  16,
);

function testUserIdPart(localpart: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(localpart);
}

const sigil = {
  [Identifier.USER]: '@',
  [Identifier.ROOM]: '!',
  [Identifier.EVENT]: '$',
  [Identifier.ROOM_ALIAS]: '#',
  [Identifier.DEVICE]: '',
};

const maxIdByteLength = 255;

export function isValidId(
  type: Identifier,
  id: string,
  domain: string,
): boolean {
  if (type === Identifier.USER) {
    const isValid = testUserIdPart(id);
    if (!isValid) return false;
  } else if (
    type !== Identifier.ROOM &&
    type !== Identifier.ROOM_ALIAS &&
    type !== Identifier.EVENT
  ) {
    return false;
  }

  if (Buffer.byteLength(`${sigil[type]}${id}:${domain}`) > maxIdByteLength) {
    return false;
  }

  return true;
}

export function generateId(
  type: Identifier.ROOM | Identifier.EVENT | Identifier.DEVICE,
  domain: string,
) {
  if (
    type !== Identifier.ROOM &&
    type !== Identifier.EVENT &&
    type !== Identifier.DEVICE
  ) {
    throw new Error('Invalid identifier type');
  }

  return `${sigil[type]}${customIdGenerator()}:${domain}`;
}

export function unixTimestamp2TimelinePoint(timestamp: number) {
  const fullTimestamp = timestamp.toString().padStart(13, '0');

  // 将时间戳分成三段
  const part1 = fullTimestamp.slice(0, 5); // 前5位
  const part2 = fullTimestamp.slice(5, 9); // 中间4位
  const part3 = fullTimestamp.slice(9, 13); // 后4位

  return `s${part1}_${part2}_${part3}`;
}

export function timelinePoint2UnixTimestamp(timelinePoint: string) {
  if (!timelinePoint.match(/^s\d{5}_\d{4}_\d{4}$/)) {
    throw new Error('Invalid format of timeline point');
  }
  const [part1, part2, part3] = timelinePoint.slice(1).split('_');
  return parseInt(`${part1}${part2}${part3}`, 10);
}
