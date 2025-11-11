import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../helpers/axios";
import toast from "react-hot-toast";

const getToken = () => `Bearer ${localStorage.getItem("token")}`;

const createAssistant = async (data) =>
  (
    await axios.post(`/assistant`, data, {
      headers: { Authorization: getToken() },
    })
  ).data;

const getAssistants = async () =>
  (
    await axios.get(`/assistants`, {
      headers: { Authorization: getToken() },
    })
  ).data;

const getAssistant = async (id) =>
  (
    await axios.get(`/assistant/${id}`, {
      headers: { Authorization: getToken() },
    })
  ).data;

const updateAssistant = async ({ id, data }) =>
  (
    await axios.put(`/assistant/${id}`, data, {
      headers: { Authorization: getToken() },
    })
  ).data;

const deleteAssistant = async (id) =>
  (
    await axios.delete(`/assistant/${id}`, {
      headers: { Authorization: getToken() },
    })
  ).data;

export const useCreateAssistant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssistant,
    onSuccess: () => {
      toast.success("Assistant created successfully");
      queryClient.invalidateQueries(["assistants"]);
    },
  });
};

export const useGetAssistants = () =>
  useQuery({
    queryKey: ["assistants"],
    queryFn: getAssistants,
    refetchOnWindowFocus: false,
  });

export const useGetAssistant = (id) =>
  useQuery({
    queryKey: ["assistant", id],
    queryFn: () => getAssistant(id),
    refetchOnWindowFocus: false,
    enabled: !!id,

  });

export const useUpdateAssistant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAssistant,
    onSuccess: () => {
      toast.success("Assistant updated successfully");
      queryClient.invalidateQueries(["assistants"]);
    },
  });
};

export const useDeleteAssistant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAssistant,
    onSuccess: () => {
      toast.success("Assistant deleted successfully");
      queryClient.invalidateQueries(["assistants"]);
    },
  });
};
