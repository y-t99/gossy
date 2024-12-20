import { z } from 'zod';

export const invite3pidSchema = z.object({
  address: z.string(),
  id_access_token: z.string(),
  id_server: z.string(),
  medium: z.string(),
});
