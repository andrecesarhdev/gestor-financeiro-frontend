import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from './category.schema';
import type { Category } from './categories.service';
import { incomeColors, expenseColors } from './colorPalette';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          type: initialData.type,
          color: initialData.color,
        }
      : { type: 'EXPENSE', color: expenseColors[0].value },
  });

  const selectedType = watch('type');
  const selectedColor = watch('color');
  const palette = selectedType === 'INCOME' ? incomeColors : expenseColors;

  function handleTypeChange(newType: 'INCOME' | 'EXPENSE') {
    setValue('type', newType);
    const newPalette = newType === 'INCOME' ? incomeColors : expenseColors;
    setValue('color', newPalette[0].value);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-lg bg-slate-800 p-6"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">
          {initialData ? 'Editar categoria' : 'Nova categoria'}
        </h3>

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
          <label className="mb-1 block text-sm text-slate-300">Tipo</label>
          <select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value as 'INCOME' | 'EXPENSE')}
            className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white"
          >
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm text-slate-300">Cor</label>
          <div className="flex flex-wrap gap-2">
            {palette.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.name}
                onClick={() => setValue('color', color.value)}
                className={`h-9 w-9 rounded-full transition ${
                  selectedColor === color.value
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800'
                    : ''
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
          <input type="hidden" {...register('color')} />
          {errors.color && (
            <p className="mt-1 text-sm text-red-400">{errors.color.message}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded bg-slate-700 py-2 text-white hover:bg-slate-600"
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