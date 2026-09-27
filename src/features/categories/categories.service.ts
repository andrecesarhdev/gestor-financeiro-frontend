import { api } from '../../lib/api';

export interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  userId: string;
}

export interface CategoryPayload {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories');
  return response.data;
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const response = await api.post<Category>('/categories', payload);
  return response.data;
}

export async function updateCategory(id: string, payload: Partial<CategoryPayload>): Promise<Category> {
  const response = await api.patch<Category>(`/categories/${id}`, payload);
  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}