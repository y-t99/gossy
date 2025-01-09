import { EncryptJWT, jwtDecrypt } from 'jose';
import * as Crypto from 'node:crypto';
import { HostKey } from '../enums';

const DEFAULT_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

const DEFAULT_SECRET = HostKey.GOSSY;

const now = () => (Date.now() / 1000) | 0;

/** Issues a JWT. By default, the JWT is encrypted using "A256GCM". */
export async function encode<Payload = JWT>(params: JWTEncodeParams<Payload>) {
  const {
    token = {} as any,
    secret = DEFAULT_SECRET,
    maxAge = DEFAULT_MAX_AGE,
  } = params;
  const encryptionSecret = await getDerivedEncryptionKey(secret);
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(now() + maxAge)
    .setJti(Crypto.randomUUID())
    .encrypt(encryptionSecret);
}

/** Decodes a issued JWT. */
export async function decode<Payload = JWT>(
  params: JWTDecodeParams,
): Promise<Payload | null> {
  const { token, secret = DEFAULT_SECRET } = params;
  if (!token) return null;
  const encryptionSecret = await getDerivedEncryptionKey(secret);
  const { payload } = await jwtDecrypt(token, encryptionSecret, {
    clockTolerance: 15,
  });
  return payload as Payload;
}

async function getDerivedEncryptionKey(secret: string) {
  const encryptionKey = await Crypto.hkdfSync(
    'sha256',
    secret,
    '',
    'Generated Encryption Key',
    32,
  );
  return new Uint8Array(encryptionKey);
}

export interface JWTDecodeParams {
  /** The issued JWT to be decoded */
  token?: string;
  /** The secret used to decode the issued JWT. */
  secret?: string;
}

export interface DefaultJWT extends Record<string, unknown> {
  userId: string;
  exp: number;
}

export type JWT = DefaultJWT;

export interface JWTEncodeParams<Payload = JWT> {
  /** The JWT payload. */
  token?: Payload;
  /** The secret used to encode the issued JWT. */
  secret?: string;
  /**
   * The maximum age of the issued JWT in seconds.
   *
   * @default 7 * 24 * 60 * 60 // 7 days
   */
  maxAge?: number;
}
