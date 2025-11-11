import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../helpers/axios";
import toast from "react-hot-toast";

const getToken = () => `Bearer ${localStorage.getItem("token")}`;

const createCampaign = async (data) => {
  const response = await axios.post(`/campaign`, data, {
    headers: { Authorization: getToken() },
  });
  return response.data;
};

const getCampaigns = async () => {
  const response = await axios.get(`/campaigns`, {
    headers: { Authorization: getToken() },
  });
  return response.data;
};


const deleteCampaign = async (id) =>
  (
    await axios.delete(`/campaign/${id}`, {
      headers: { Authorization: getToken() },
    })
  ).data;
  const updateCampaign = async ({ id, data }) =>
    (
      await axios.put(`/campaign/${id}`, data, {
        headers: { Authorization: getToken() },
      })
    ).data;
  
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries(["campaigns"]);
      toast.success("Campaign created successfully");
    },
    onError: (error) => {
      console.error(error.message);
    },
  });
};

export const useGetCampaigns = () =>
  useQuery({
    queryKey: ["campaigns"],
    queryFn: getCampaigns,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Failed to fetch campaigns:", error.message);
    },
    fallbackData: [],
  });

  export const useDeleteCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: deleteCampaign,
      onSuccess: () => {
        queryClient.invalidateQueries(["campaigns"]);
      toast.success("Campaign deleted successfully");

      },
    });
  };
  
  export const useUpdateCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: updateCampaign,
      onSuccess: () => {
        queryClient.invalidateQueries(["campaigns"]);
      toast.success("Campaign updated successfully");

      },
    });
  };
  
