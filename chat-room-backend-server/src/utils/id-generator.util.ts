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
