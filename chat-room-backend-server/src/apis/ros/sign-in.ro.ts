import { userIdentifierSchema, AuthenticationType } from '../../domains';
import { z } from 'zod';

export const signinRoSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignInRo = z.infer<typeof signinRoSchema>;

export const matrixSigninRequestBodyRoSchema = z.object({
  device_id: z.string().optional(),
  identifier: userIdentifierSchema,
  initial_device_display_name: z.string().optional(),
  password: z.string().optional(),
  refresh_token: z.boolean().optional(),
  token: z.string().optional(),
  type: z.enum([AuthenticationType.PASSWORD, AuthenticationType.TOKEN]),
});

export type MatrixSigninRequestBodyRo = z.infer<
  typeof matrixSigninRequestBodyRoSchema
>;
