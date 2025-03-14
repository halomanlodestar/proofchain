import { SignInFormValues, SignUpFormValues } from "@/schemas/authForms.tsx";
import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

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
    me: async () => {
      return await client.get("/auth/me");
    },
  },

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
   *
   * end points:
   * - POST /transactions
   * - GET /transactions/:id
   * - GET /transactions/from/:id
   * - GET /transactions/to/:id
   * - GET /transactions/from/:senderId/to/:recipientId
   */
  transaction: {
    create: async (data: { amount: number; recipientId: string }) => {
      return await client.post("/transactions", data);
    },
    get: async (id: string) => {
      return await client.get(`/transactions/${id}`);
    },
    getFrom: async (id: string) => {
      return await client.get(`/transactions/from/${id}`);
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
};
