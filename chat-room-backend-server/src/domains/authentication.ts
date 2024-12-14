import z from 'zod';

/**
 * @see https://spec.matrix.org/v1.12/client-server-api/#authentication-types
 */
export enum AuthenticationType {
  PASSWORD = 'm.login.password',
  TOKEN = 'm.login.token',
  RECAPTCHA = 'm.login.recaptcha',
  SSO = 'm.login.sso',
  EMAIL_IDENTITY = 'm.login.email.identity',
  MSISDN = 'm.login.msisdn',
  DUMMY = 'm.login.dummy',
  REGISTRATION_TOKEN = 'm.login.registration_token',
  TERMS = 'm.login.terms',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginTermsParamsSchema = z.object({
  policies: z.record(
    z.string(),
    z.object({
      version: z.string(),
      links: z.record(
        z.string(),
        z.object({
          name: z.string(),
          url: z.string(),
        }),
      ),
    }),
  ),
});

export type LoginTermsParams = z.infer<typeof loginTermsParamsSchema>;

const flowStagesSchema = z.object({
  stages: z.array(z.nativeEnum(AuthenticationType)),
});

const stageParamsSchema = z.record(z.string(), z.string());

export const authRequirementSchema = z.object({
  flows: z.array(flowStagesSchema),
  params: z.record(z.string().describe('stage type'), stageParamsSchema),
  session: z.string(),
});

export const authResponseSchema = authRequirementSchema.extend({
  completed: z.array(z.nativeEnum(AuthenticationType)),
});

export type AuthRequirement = z.infer<typeof authRequirementSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const loginFlowSchema = z.object({
  type: z.nativeEnum(AuthenticationType),
  get_login_token: z.boolean().optional(),
  user: z.boolean().optional(),
});

export type LoginFlow = z.infer<typeof loginFlowSchema>;
