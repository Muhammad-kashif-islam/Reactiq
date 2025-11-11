import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../helpers/axios";
import toast from "react-hot-toast";

const getToken = () => `Bearer ${localStorage.getItem("token")}`;

const availableNumbers = async (data) =>
  (
    await axios.post(`/available-numbers`, data, {
      headers: { Authorization: getToken() },
    })
  ).data;

const purchaseNumber = async (data) =>
  (
    await axios.post(`/purchase-number`, data, {
      headers: { Authorization: getToken() },
    })
  ).data;


const getPurchasedNumbers = async () =>
    (
      await axios.get(`/purchased-numbers`, {
        headers: { Authorization: getToken() },
      })
    ).data;
 const returnNumber = async (id) =>
      (
        await axios.post(`/return-phone-number/${id}`, {
          headers: { Authorization: getToken() },
        })
      ).data;

export const usePurchaseNumber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: purchaseNumber,
    onSuccess: () => {
      toast.success("Phone Number purchased successfully");
      queryClient.invalidateQueries(["purchasedNumbers"]);
    },
  });
};

export const useAvailableNumbers  = (data,enabled) => {
    return useQuery({
        queryKey: ["availableNumbers", data],
        queryFn :() => availableNumbers(data),
        enabled: enabled, 
        onError: (error) => {
            toast.error("Failed to fetch available numbers.");
            console.error("Error fetching available numbers:", error);
          },
    })

}

export const useGetPurchasedNumbers = () =>
  useQuery({
    queryKey: ["purchasedNumbers"],
    queryFn: getPurchasedNumbers,
    refetchOnWindowFocus: false,
  });
  export const useReturnNumber = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: returnNumber,
      onSuccess: () => {
        toast.success("Assistant deleted successfully");
        queryClient.invalidateQueries(["assistants"]);
      },
    });
  };