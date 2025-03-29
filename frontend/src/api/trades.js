import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${BASE_URL}/api/trades`;

const fetchTrades = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const fetchTrade = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const useTrades = () => {
  return useQuery({
    queryKey: ['trades'],
    queryFn: fetchTrades,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTrade = (id) => {
  return useQuery({
    queryKey: ['trade', id],
    queryFn: () => fetchTrade(id),
    enabled: !!id,
  });
};

// Create Trade
export const useCreateTrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trade) => axios.post(API_URL, trade),
    onMutate: async (newTrade) => {
      await queryClient.cancelQueries(['trades']);
      const previousTrades = queryClient.getQueryData(['trades']);
      queryClient.setQueryData(['trades'], (old) => [...old, newTrade]);
      return { previousTrades };
    },
    onError: (err, newTrade, context) => {
      queryClient.setQueryData(['trades'], context.previousTrades);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['trades']);
    },
  });
};

// Update Trade
export const useUpdateTrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, trade }) => axios.put(`${API_URL}/${id}`, trade),
    onMutate: async ({ id, trade }) => {
      await queryClient.cancelQueries(['trades']);
      const previousTrades = queryClient.getQueryData(['trades']);
      queryClient.setQueryData(['trades'], (old) =>
        old.map((t) => (t.id === id ? { ...t, ...trade } : t)),
      );
      return { previousTrades };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['trades'], context.previousTrades);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['trades']);
    },
  });
};

// Delete Trade
export const useDeleteTrade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axios.delete(`${API_URL}/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries(['trades']);
      const previousTrades = queryClient.getQueryData(['trades']);
      queryClient.setQueryData(['trades'], (old) => old.filter((t) => t.id !== id));
      return { previousTrades };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['trades'], context.previousTrades);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['trades']);
    },
  });
};
