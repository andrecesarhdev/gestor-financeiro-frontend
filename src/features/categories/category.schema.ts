import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Nome precisa ter pelo menos 2 caracteres'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'Selecione um tipo',
  }),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor precisa estar em formato hexadecimal'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;