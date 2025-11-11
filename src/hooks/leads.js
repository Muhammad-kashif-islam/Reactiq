import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../helpers/axios";
import toast from "react-hot-toast";

const getToken = () => `Bearer ${localStorage.getItem("token")}`;

const createCategory = async (data) =>
  (
    await axios.post(`/category`, data, {
      headers: { Authorization: getToken() },
    })
  ).data;



// In your createCSV function:
const createCSV = async (data) => {
  // For debugging, create a plain object to log
  const debugData = {};
  for (let [key, value] of data.entries()) {
    debugData[key] = value;
  }
  console.log("CSV creation data contents:", debugData);

  return (
    await axios.post(`/csv-leads`, data, {
      headers: { 
        Authorization: getToken(),
        'Content-Type': 'multipart/form-data'  // Explicitly set content type
      },
    })
  ).data;
};
const getCategories = async () =>
  (
    await axios.get(`/categories`, {
      headers: { Authorization: getToken() },
    })
  ).data;

  
const deleteCategory = async (id) =>
  (
    await axios.delete(`/category/${id}`, {
      headers: { Authorization: getToken() },
    })
  ).data;

const createLead = async (data) =>
  (
    await axios.post(`/lead`, data, {
      headers: { Authorization: getToken() },
    })
  ).data;

const getLeads = async () =>
  (
    await axios.get(`/leads`, {
      headers: { Authorization: getToken() },
    })
  ).data;

const getLead = async (id) =>
  (
    await axios.get(`/lead/${id}`, {
      headers: { Authorization: getToken() },
    })
  ).data;

const updateLead = async ({ id, data }) =>
  (
    await axios.put(`/lead/${id}`, data, {
      headers: { Authorization: getToken() },
    })
  ).data;

const deleteLead = async (id) =>
  (
    await axios.delete(`/lead/${id}`, {
      headers: { Authorization: getToken() },
    })
  ).data;


  const updateCategory = async ({id, data}) => {
    const res = await axios.put(`/category/${id}`, {name:data}, {
        headers: { Authorization: getToken() },
      });
      return res.data;
    };


    
const leadCall = async (data) =>
  (
    await axios.post(`/make-call`, data, {
      headers: { Authorization: getToken() },
    })
  ).data;



export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries(["categories"]);
    },
  });
};
export const useLeadCall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leadCall,
    onSuccess: () => {
      toast.success("Call initiated successfully");
      queryClient.invalidateQueries(["categories"]);
    },
  });
};
export const useCreateCSV = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCSV,
    onSuccess: () => {
      toast.success("CSV created successfully");
      // queryClient.invalidateQueries(["categories"]);
    },
  });
};
export const useGetCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
  });

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries(["categories"]);
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
    },
  });
};

export const useGetLeads = () =>
  useQuery({
    queryKey: ["leads"],
    queryFn: getLeads,
    refetchOnWindowFocus: false,
  });

export const useGetLead = (id) =>
  useQuery({
    queryKey: ["lead", id],
    queryFn: () => getLead(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLead,
    onSuccess: () => {
      toast.success("Lead updated successfully");
      queryClient.invalidateQueries(["leads"]);
    },
  });
};
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries(["leads"]);
    },
  });
};
export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries(["leads"]);
    },
  });
};
