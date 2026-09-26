import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginSchema, type LoginFormData } from './login.schema';
import { loginRequest } from './auth.service';
import { useAuth } from './useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setApiError(null);
    try {
      const response = await loginRequest(data);
      login(response.user, response.accessToken);
      navigate('/');
    } catch {
      setApiError('Email ou senha inválidos.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-lg bg-slate-800 p-8"
      >
        <h1 className="mb-6 text-2xl font-bold text-white">Entrar</h1>

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
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}