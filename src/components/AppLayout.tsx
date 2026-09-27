import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-slate-900">
      <header className="border-b border-slate-800 bg-slate-800/50">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <h1 className="text-xl font-bold text-emerald-400">Poupa+</h1>
            <nav className="flex flex-wrap gap-4">
              <Link to="/" className="text-sm text-slate-300 hover:text-white">
                Dashboard
              </Link>
              <Link to="/transactions" className="text-sm text-slate-300 hover:text-white">
                Transações
              </Link>
              <Link to="/categories" className="text-sm text-slate-300 hover:text-white">
                Categorias
              </Link>
            </nav>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="truncate text-sm text-slate-300">Olá, {user?.name}</span>
            <button
              onClick={logout}
              className="shrink-0 rounded bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}