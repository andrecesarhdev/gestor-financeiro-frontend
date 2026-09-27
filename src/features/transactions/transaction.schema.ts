import { z } from 'zod';

export const transactionSchema = z.object({
  description: z.string().min(2, 'Descrição precisa ter pelo menos 2 caracteres'),
  amount: z.coerce.number().positive('Valor precisa ser maior que zero'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'Selecione um tipo',
  }),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;