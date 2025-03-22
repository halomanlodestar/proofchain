import { SignInFormValues, SignUpFormValues } from "@/schemas/authForms.tsx";
import axios from "axios";
import { TransactionStatus, TransactionMini, User } from "@/types";

export const client = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

export const api = {
  /**
   * Auth API
   * - POST /auth/register
   * - POST /auth/login
   * - POST /auth/logout
   * - GET /auth/me
   */
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
    me: async (accessToken: string) => {
      return (
        await client.get<{ user: User }>("/auth/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.user;
    },
  },

  /**
   * User API
   * - GET /users/:id
   * - PUT /users/:id
   */
  user: {
    get: async (id: string) => {
      return await client.get(`/users/${id}`);
    },
    update: async (id: string, data: { email: string; phone: string }) => {
      return await client.put(`/users/${id}`, data);
    },
  },

  /**
   * Transaction API
   * - POST /transactions
   * - GET /transactions/:id
   * - GET /transactions/from/:id
   * - GET /transactions/to/:id
   * - GET /transactions/from/:senderId/to/:recipientId
   */
  transaction: {
    create: async (
      data: {
        amount: number;
        recipientId: string;
        expirationTime: string;
      },
      token: string,
    ) => {
      return await client.post("/transactions", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    get: async (id: string) => {
      return await client.get(`/transactions/${id}`);
    },
    getFrom: async (id: string, type: TransactionStatus = "confirmed") => {
      const status = type === "confirmed" ? "" : type;
      return await client.get<{ transactions: TransactionMini[] }>(
        `/transactions/from/${id}/${status}`,
      );
    },
    getTo: async (id: string) => {
      return await client.get(`/transactions/to/${id}`);
    },
    getBetween: async (senderId: string, recipientId: string) => {
      return await client.get(
        `/transactions/from/${senderId}/to/${recipientId}`,
      );
    },
  },

  users: {
    findByEmail: async (email: string) => {
      return await client.get<{ user: User }>(`/users/${email}`);
    },
  },
};
