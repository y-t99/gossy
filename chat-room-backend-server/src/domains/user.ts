import { z } from 'zod';

import { Identifier, ThirdpartyIdType } from '../enums';

const identifierUserContentSchema = z.object({
  type: z.literal(Identifier.USER),
  user: z.string(),
});

const identifierThirdPartyContentSchema = z.object({
  type: z.literal(Identifier.THIRDPARTY),
  medium: z.nativeEnum(ThirdpartyIdType),
  address: z.string(),
});

const identifierPhoneContentSchema = z.object({
  type: z.literal(Identifier.PHONE),
  country: z.string(),
  phone: z.string(),
});

export const userIdentifierSchema = z.union([
  identifierUserContentSchema,
  identifierThirdPartyContentSchema,
  identifierPhoneContentSchema,
]);

export type UserIdentifier = z.infer<typeof userIdentifierSchema>;
