import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client.ts";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { TransactionFilled } from "@/types";
import { useNavigate } from "react-router";
import { CreateTransactionValues } from "@/schemas/createTransaction.ts";
import { ZodError } from "zod";

export const useTransactionMutations = (
  id?: string,
  refetch?: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<TransactionFilled, Error>>,
) => {
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationKey: ["createTransaction"],
    mutationFn: async ({
      recipientId,
      expirationTime,
      amount,
    }: CreateTransactionValues) => {
      await api.transaction.create({
        amount,
        recipientId,
        expirationTime: expirationTime.toISOString(),
      });
    },
    onSuccess: () => {
      // form.reset();
      toast.success("Transaction successfully created");
    },
    onError: (e: unknown) => {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      }

      if (e instanceof ZodError) {
        console.log(e);
      }
    },
  });

  const acceptMutation = useMutation({
    mutationKey: ["acceptTransaction", id],
    mutationFn: async () => {
      await api.transaction.accept(id!);
    },
    onSuccess: async () => {
      toast.success("Transaction accepted successfully");
      await refetch!();
    },
    onError: async (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("You are not authorized to perform this action");
        } else {
          toast.error("An error occurred. Please try again later");
        }
      }
    },
  });

  const rejectMutation = useMutation({
    mutationKey: ["rejectTransaction", id],
    mutationFn: async () => {
      await api.transaction.reject(id!);
    },
    onSuccess: async () => {
      toast.success("Transaction rejected successfully");
      await refetch!();
    },
    onError: async (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("You are not authorized to perform this action");
        } else {
          toast.error("An error occurred. Please try again later");
        }
      }
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["deleteTransaction", id],
    mutationFn: async () => {
      await api.transaction.delete(id!);
    },
    onSuccess: async () => {
      navigate("/transactions");
      toast.success("Transaction deleted successfully");
    },
    onError: async (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An error occurred. Please try again later");
        }
      }
    },
  });

  return {
    createMutation,
    acceptMutation,
    rejectMutation,
    deleteMutation,
  };
};
