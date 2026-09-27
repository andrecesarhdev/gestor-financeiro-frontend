import { api } from '../../lib/api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface RegisterResponseUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  return response.data;
}

export async function registerRequest(payload: RegisterPayload): Promise<RegisterResponseUser> {
  const response = await api.post<RegisterResponseUser>('/auth/register', payload);
  return response.data;
}