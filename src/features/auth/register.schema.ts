import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome precisa ter pelo menos 2 caracteres'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(6, 'Senha precisa ter pelo menos 6 caracteres'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;