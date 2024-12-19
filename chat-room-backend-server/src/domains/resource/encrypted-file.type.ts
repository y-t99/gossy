import z from 'zod';

export const jwkSchema = z.object({
  kty: z.string(),
  key_ops: z.array(z.string()),
  alg: z.string(),
  k: z.string(),
  ext: z.string(),
});

/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#sending-encrypted-attachments
 */
export const encryptedFileSchema = z.object({
  url: z.string().url(),
  key: jwkSchema,
  iv: z.string(),
  hashed: z.record(z.string()),
  v: z.string(),
});

export type EncryptedFile = z.infer<typeof encryptedFileSchema>;
