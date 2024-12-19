import { z } from 'zod';

export const roomCanonicalAliasContentSchema = z.object({
  alias: z
    .string()
    .nullable()
    .optional()
    .describe(
      'The canonical alias for the room. If not present, null, or empty the room should be considered to have no canonical alias.',
    ),
  alt_aliases: z
    .array(z.string())
    .nullable()
    .optional()
    .describe(
      'Alternative aliases the room advertises. This list can have aliases despite the alias field being null, empty, or otherwise not present.',
    ),
});

export type RoomCanonicalAliasContent = z.infer<
  typeof roomCanonicalAliasContentSchema
>;
