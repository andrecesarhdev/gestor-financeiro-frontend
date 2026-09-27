import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from './register.schema';
import { registerRequest } from './auth.service';
import axios from 'axios';

export function RegisterPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setApiError(null);
    try {
      await registerRequest(data);
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setApiError('Este email já está cadastrado.');
      } else {
        setApiError('Não foi possível concluir o cadastro. Tente novamente.');
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-400">Poupa+</h1>
          <p className="mt-1 text-sm text-slate-400">Gestão financeira pessoal</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg bg-slate-800 p-8"
        >
          <h2 className="mb-6 text-2xl font-bold text-white">Criar conta</h2>

          <div className="mb-4">
            <label className="mb-1 block text-sm text-slate-300">Nome</label>
            <input
              type="text"
              {...register('name')}
              className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm text-slate-300">Senha</label>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {apiError && (
            <p className="mb-4 text-sm text-red-400">{apiError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-emerald-500 py-2 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="mt-4 text-center text-sm text-slate-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-emerald-400 hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}