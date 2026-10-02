import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  transactionSchema,
  type TransactionFormInput,
  type TransactionFormData,
} from './transaction.schema';
import type { Transaction } from './transactions.service';
import type { Category } from '../categories/categories.service';

interface TransactionFormProps {
  categories: Category[];
  initialData?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function TransactionForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransactionFormInput, unknown, TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData
      ? {
          description: initialData.description,
          amount: initialData.amount,
          type: initialData.type,
          date: initialData.date.slice(0, 10),
          categoryId: initialData.categoryId,
        }
      : { type: 'EXPENSE' },
  });

  const selectedType = watch('type');
  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const inputClasses =
    'w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white';
  const labelClasses = 'mb-1 block text-sm text-slate-600 dark:text-slate-300';
  const errorClasses = 'mt-1 text-sm text-red-500 dark:text-red-400';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-lg bg-white p-6 dark:bg-slate-800"
      >
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {initialData ? 'Editar transação' : 'Nova transação'}
        </h3>

        <div className="mb-4">
          <label className={labelClasses}>Descrição</label>
          <input type="text" {...register('description')} className={inputClasses} />
          {errors.description && (
            <p className={errorClasses}>{errors.description.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className={labelClasses}>Valor</label>
          <input
            type="number"
            step="0.01"
            {...register('amount')}
            className={inputClasses}
          />
          {errors.amount && <p className={errorClasses}>{errors.amount.message}</p>}
        </div>

        <div className="mb-4">
          <label className={labelClasses}>Tipo</label>
          <select {...register('type')} className={inputClasses}>
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </div>

        <div className="mb-4">
          <label className={labelClasses}>Categoria</label>
          <select {...register('categoryId')} className={inputClasses}>
            <option value="">Selecione...</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className={errorClasses}>{errors.categoryId.message}</p>
          )}
          {filteredCategories.length === 0 && (
            <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
              Nenhuma categoria de {selectedType === 'INCOME' ? 'receita' : 'despesa'} cadastrada ainda.
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className={labelClasses}>Data</label>
          <input type="date" {...register('date')} className={inputClasses} />
          {errors.date && <p className={errorClasses}>{errors.date.message}</p>}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded bg-slate-200 py-2 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded bg-emerald-500 py-2 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}