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
    await axios.get(`/all-assistants`, {
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

// for user
const getAssistantByUser = async (userId) =>
  (
    await axios.get(`/user-assistants/${userId}`, {
      headers: { Authorization: getToken() },
    })
  ).data;

const getLeadByUser = async (userId) =>
  (
    await axios.get(`/user-leads/${userId}`, {
      headers: { Authorization: getToken() },
    })
  ).data;

const getPhoneNumbersrByUser = async (userId) =>
  (
    await axios.get(`/user-phoneNumbers/${userId}`, {
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

export const useGetAssistantsByUser = (userId) =>
  useQuery({
    queryKey: ["user-assistants", userId],
    queryFn: () => getAssistantByUser(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

export const useGetLeadsByUser = (userId) =>
  useQuery({
    queryKey: ["user-Leads", userId],
    queryFn: () => getLeadByUser(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

export const useGetPhoneNumbersByUser = (userId) =>
  useQuery({
    queryKey: ["user-phoneNumbers", userId],
    queryFn: () => getPhoneNumbersrByUser(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });
