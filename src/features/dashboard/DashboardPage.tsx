import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getSummary, getByCategory } from './reports.service';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function DashboardPage() {
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: getSummary,
  });

  const { data: categoryData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['reports', 'by-category'],
    queryFn: getByCategory,
  });

  if (isLoadingSummary || isLoadingCategories) {
    return <p className="text-slate-400">Carregando...</p>;
  }

  const incomeData = (categoryData ?? [])
    .filter((c) => c.type === 'INCOME')
    .sort((a, b) => b.total - a.total);

  const expenseData = (categoryData ?? [])
    .filter((c) => c.type === 'EXPENSE')
    .sort((a, b) => b.total - a.total);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">Dashboard</h2>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-800 p-6">
          <p className="text-sm text-slate-400">Receitas</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {formatCurrency(summary?.totalIncome ?? 0)}
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-6">
          <p className="text-sm text-slate-400">Despesas</p>
          <p className="mt-1 text-2xl font-bold text-red-400">
            {formatCurrency(summary?.totalExpense ?? 0)}
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-6">
          <p className="text-sm text-slate-400">Saldo</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {formatCurrency(summary?.balance ?? 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-slate-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Receitas por categoria
          </h3>

          {incomeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(incomeData.length * 50, 120)}>
              <BarChart data={incomeData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {incomeData.map((entry) => (
                    <Cell key={entry.categoryId} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400">Nenhuma receita registrada neste período.</p>
          )}
        </div>

        <div className="rounded-lg bg-slate-800 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Despesas por categoria
          </h3>

          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(expenseData.length * 50, 120)}>
              <BarChart data={expenseData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {expenseData.map((entry) => (
                    <Cell key={entry.categoryId} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400">Nenhuma despesa registrada neste período.</p>
          )}
        </div>
      </div>
    </div>
  );
}