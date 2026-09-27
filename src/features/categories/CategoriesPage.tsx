import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from './categories.service';
import { CategoryForm } from './CategoryForm';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import type { CategoryFormData } from './category.schema';

export function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeletingCategory(null);
    },
  });

  function handleCreate(data: CategoryFormData) {
    createMutation.mutate(data);
  }

  function handleUpdate(data: CategoryFormData) {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    }
  }

  function handleConfirmDelete() {
    if (deletingCategory) {
      deleteMutation.mutate(deletingCategory.id);
    }
  }

  if (isLoading) {
    return <p className="text-slate-400">Carregando...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Categorias</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="rounded bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600"
        >
          Nova categoria
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-lg bg-slate-800 p-4"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div>
                <p className="font-medium text-white">{category.name}</p>
                <p className="text-xs text-slate-400">
                  {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingCategory(category)}
                className="text-sm text-emerald-400 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => setDeletingCategory(category)}
                className="text-sm text-red-400 hover:underline"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={createMutation.isPending}
        />
      )}

      {editingCategory && (
        <CategoryForm
          initialData={editingCategory}
          onSubmit={handleUpdate}
          onCancel={() => setEditingCategory(null)}
          isSubmitting={updateMutation.isPending}
        />
      )}

      {deletingCategory && (
        <ConfirmDialog
          title="Excluir categoria"
          message={`Tem certeza que deseja excluir "${deletingCategory.name}"? Essa ação não pode ser desfeita.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingCategory(null)}
          isConfirming={deleteMutation.isPending}
        />
      )}
    </div>
  );
}