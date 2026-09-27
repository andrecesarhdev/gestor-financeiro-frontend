import { api } from '../../lib/api';

export interface SummaryResponse {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface CategorySummary {
  categoryId: string;
  name: string;
  color: string;
  type: 'INCOME' | 'EXPENSE';
  total: number;
}

export async function getSummary(): Promise<SummaryResponse> {
  const response = await api.get<SummaryResponse>('/reports/summary');
  return response.data;
}

export async function getByCategory(): Promise<CategorySummary[]> {
  const response = await api.get<CategorySummary[]>('/reports/by-category');
  return response.data;
}