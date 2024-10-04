import z from 'zod';

export const accountSchema = z.object({
  id: z.string().trim(),
  userId: z.string().trim(),
  type: z.enum(['MERCHANT', 'COMMON'], {
    message: 'must be MERCHANT or COMMON',
  }),
  initialBalance: z.number().optional(),
  createdAt: z.date(),
});

export const accountParamsSchema = z.object({
  accountId: z.string().trim(),
});
