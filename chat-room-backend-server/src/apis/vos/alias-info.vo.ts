import { z } from 'zod';

const _aliasInfoVoSchema = z.object({
  servers: z.array(z.string()),
  room_id: z.string(),
});

export type AliasInfoVo = z.infer<typeof _aliasInfoVoSchema>;

export const _aliasesVoSchema = z.object({
  aliases: z.array(z.string()),
});

export type AliasesVo = z.infer<typeof _aliasesVoSchema>;
