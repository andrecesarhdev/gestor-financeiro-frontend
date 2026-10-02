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

export interface PeriodFilter {
  startDate: string;
  endDate: string;
}

export async function getSummary(period: PeriodFilter): Promise<SummaryResponse> {
  const response = await api.get<SummaryResponse>('/reports/summary', {
    params: period,
  });
  return response.data;
}

export async function getByCategory(period: PeriodFilter): Promise<CategorySummary[]> {
  const response = await api.get<CategorySummary[]>('/reports/by-category', {
    params: period,
  });
  return response.data;
}