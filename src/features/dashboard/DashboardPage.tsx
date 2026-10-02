import { useState } from 'react';
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
import { getSummary, getByCategory, type PeriodFilter } from './reports.service';
import { getPresetRange } from './periodPresets';
import { PeriodSelector } from './PeriodSelector';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function DashboardPage() {
  const [period, setPeriod] = useState<PeriodFilter>(() => getPresetRange('thisMonth'));

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['reports', 'summary', period],
    queryFn: () => getSummary(period),
  });

  const { data: categoryData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['reports', 'by-category', period],
    queryFn: () => getByCategory(period),
  });

  const incomeData = (categoryData ?? [])
    .filter((c) => c.type === 'INCOME')
    .sort((a, b) => b.total - a.total);

  const expenseData = (categoryData ?? [])
    .filter((c) => c.type === 'EXPENSE')
    .sort((a, b) => b.total - a.total);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
        Dashboard
      </h2>

      <PeriodSelector value={period} onChange={setPeriod} />

      {isLoadingSummary || isLoadingCategories ? (
        <p className="text-slate-500 dark:text-slate-400">Carregando...</p>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-none">
              <p className="text-sm text-slate-500 dark:text-slate-400">Receitas</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(summary?.totalIncome ?? 0)}
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-none">
              <p className="text-sm text-slate-500 dark:text-slate-400">Despesas</p>
              <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(summary?.totalExpense ?? 0)}
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-none">
              <p className="text-sm text-slate-500 dark:text-slate-400">Saldo</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(summary?.balance ?? 0)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-none">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Receitas por categoria
              </h3>

              {incomeData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(incomeData.length * 50, 120)}
                >
                  <BarChart data={incomeData} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      className="text-slate-600 dark:text-slate-300"
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }}
                    />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                      {incomeData.map((entry) => (
                        <Cell key={entry.categoryId} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  Nenhuma receita registrada neste período.
                </p>
              )}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800 dark:shadow-none">
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Despesas por categoria
              </h3>

              {expenseData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(expenseData.length * 50, 120)}
                >
                  <BarChart data={expenseData} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tick={{ fill: 'currentColor', fontSize: 12 }}
                      className="text-slate-600 dark:text-slate-300"
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }}
                    />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                      {expenseData.map((entry) => (
                        <Cell key={entry.categoryId} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  Nenhuma despesa registrada neste período.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}