import axios from "axios";

export const api = {
  auth: {
    signUp: async (data: {
      email: string;
      password: string;
      phone: string;
    }) => {
      return await axios.post("/auth/sign-up", data);
    },
    signIn: async (data: { email: string; password: string }) => {
      return await axios.post("/auth/sign-in", data);
    },
    signOut: async () => {
      return await axios.post("/auth/sign-out");
    },
    me: async () => {
      return await axios.get("/auth/me");
    },
  },

  user: {
    get: async (id: string) => {
      return await axios.get(`/users/${id}`);
    },
    update: async (id: string, data: { email: string; phone: string }) => {
      return await axios.put(`/users/${id}`, data);
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
      return await axios.post("/transactions", data);
    },
    get: async (id: string) => {
      return await axios.get(`/transactions/${id}`);
    },
    getFrom: async (id: string) => {
      return await axios.get(`/transactions/from/${id}`);
    },
    getTo: async (id: string) => {
      return await axios.get(`/transactions/to/${id}`);
    },
    getBetween: async (senderId: string, recipientId: string) => {
      return await axios.get(
        `/transactions/from/${senderId}/to/${recipientId}`,
      );
    },
  },
};
