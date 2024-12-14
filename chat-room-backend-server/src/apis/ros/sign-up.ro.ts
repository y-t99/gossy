import z from 'zod';
import { authenticationDataSchema } from './authentication-data';

export const signupRoSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  againPassword: z.string(),
  code: z.string(),
});

export enum SignupKind {
  GUEST = 'guest',
  USER = 'user',
}

export const matrixSignupRequestParamsRoSchema = z.object({
  kind: z.nativeEnum(SignupKind),
});

export type MatrixSignupRequestParamsRo = z.infer<
  typeof matrixSignupRequestParamsRoSchema
>;

export const matrixSignupRequestBodyRoSchema = z.object({
  auth: authenticationDataSchema,
  device_id: z.string().optional(),
  inhibit_login: z.boolean().default(false),
  initial_device_display_name: z.string(),
  password: z.string(),
  refresh_token: z.boolean().optional(),
  username: z.string().optional(),
});

export type MatrixSignupRequestBodyRo = z.infer<
  typeof matrixSignupRequestBodyRoSchema
>;
