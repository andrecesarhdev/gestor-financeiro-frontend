import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  type Transaction,
} from './transactions.service';
import { getCategories } from '../categories/categories.service';
import { TransactionForm } from './TransactionForm';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import type { TransactionFormData } from './transaction.schema';

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function TransactionsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransactionFormData }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setEditingTransaction(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setDeletingTransaction(null);
    },
  });

  function handleCreate(data: TransactionFormData) {
    createMutation.mutate(data);
  }

  function handleUpdate(data: TransactionFormData) {
    if (editingTransaction) {
      updateMutation.mutate({ id: editingTransaction.id, data });
    }
  }

  function handleConfirmDelete() {
    if (deletingTransaction) {
      deleteMutation.mutate(deletingTransaction.id);
    }
  }

  if (isLoading) {
    return <p className="text-slate-400">Carregando...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Transações</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="rounded bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600"
        >
          Nova transação
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-slate-800">
        {transactions && transactions.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 text-sm text-slate-400">
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-700/50">
                  <td className="px-4 py-3 text-white">{transaction.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: transaction.category.color }}
                      />
                      {transaction.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {formatDate(transaction.date)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      transaction.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="mr-3 text-sm text-emerald-400 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeletingTransaction(transaction)}
                      className="text-sm text-red-400 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-slate-400">Nenhuma transação registrada ainda.</p>
        )}
      </div>

      {isFormOpen && (
        <TransactionForm
          categories={categories ?? []}
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={createMutation.isPending}
        />
      )}

      {editingTransaction && (
        <TransactionForm
          categories={categories ?? []}
          initialData={editingTransaction}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTransaction(null)}
          isSubmitting={updateMutation.isPending}
        />
      )}

      {deletingTransaction && (
        <ConfirmDialog
          title="Excluir transação"
          message={`Tem certeza que deseja excluir "${deletingTransaction.description}"? Essa ação não pode ser desfeita.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingTransaction(null)}
          isConfirming={deleteMutation.isPending}
        />
      )}
    </div>
  );
}