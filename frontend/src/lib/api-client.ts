import { SignInFormValues, SignUpFormValues } from "@/schemas/authForms.tsx";
import axios, { AxiosError } from "axios";
import {
  TransactionStatus,
  TransactionMini,
  User,
  TransactionFilled,
} from "@/types";
import { useAuthStore } from "@/store/auth.ts";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not set");
}

export const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error: AxiosError) => {
    if (error.config?.url === "/auth/refresh") {
      useAuthStore.getState().clearToken();
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const { accessToken } = (await api.auth.refreshToken()).data;

      useAuthStore.getState().setToken(accessToken);
    }
  },
);

export const api = {
  auth: {
    signUp: async (data: SignUpFormValues) => {
      return await client.post("/auth/register", data);
    },
    signIn: async (data: SignInFormValues) => {
      return await client.post("/auth/login", data);
    },
    signOut: async () => {
      return await client.post("/auth/logout");
    },
    refreshToken: async () => {
      return await client.post<{ accessToken: string }>("/auth/refresh");
    },
    me: async () => {
      return (await client.get<{ user: User }>("/auth/me")).data.user;
    },
  },

  transaction: {
    create: async (data: {
      amount: number;
      recipientId: string;
      expirationTime: string;
    }) => {
      return await client.post("/transactions", data);
    },
    getById: async (id: string) => {
      return await client.get<{ transaction: TransactionFilled }>(
        `/transactions/${id}`,
      );
    },
    accept: async (id: string) => {
      return await client.put(`/transactions/${id}/accept/`);
    },
    reject: async (id: string) => {
      return await client.put(`/transactions/${id}/reject/`);
    },
    get: async (status: TransactionStatus = "SUCCESSFUL") => {
      return await client.get<{ transactions: TransactionMini[] }>(
        `/transactions?status=${status}`,
      );
    },
    getWith: async (id: string) => {
      return await client.get<{ transactions: TransactionMini[] }>(
        `/transactions/with/${id}`,
      );
    },
    delete: async (id: string) => {
      return await client.delete(`/transactions/${id}`);
    },
  },

  users: {
    findByEmail: async (email: string) => {
      return await client.get<{ user: User }>(`/users/${email}`);
    },
  },
};
