import { api } from '../../lib/api';
import type { Category } from '../categories/categories.service';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  categoryId: string;
  userId: string;
  category: Category;
}

export interface TransactionPayload {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  categoryId: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await api.get<Transaction[]>('/transactions');
  return response.data;
}

export async function createTransaction(payload: TransactionPayload): Promise<Transaction> {
  const response = await api.post<Transaction>('/transactions', payload);
  return response.data;
}

export async function updateTransaction(id: string, payload: Partial<TransactionPayload>): Promise<Transaction> {
  const response = await api.patch<Transaction>(`/transactions/${id}`, payload);
  return response.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transactions/${id}`);
}