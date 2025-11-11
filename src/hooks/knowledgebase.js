import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "../helpers/axios";

const getToken = () => `Bearer ${localStorage.getItem("token")}`;

const uploadDocument = async (data) => {
  const debugData = {};
  for (let [key, value] of data.entries()) {
    debugData[key] = value;
  }
  console.log("CSV creation data contents:", debugData);

  return (
    await axios.post(`/knowledge-base`, data, {
      headers: { 
        Authorization: getToken(),
        'Content-Type': 'multipart/form-data'
      },
    })
  ).data;
};

const deleteDocument = async (id) =>
  (
    await axios.delete(`/document/${id}`, {
      headers: { Authorization: getToken() },
    })
  ).data;
  const getAttachedAssistant = async (id) =>
    (
      await axios.get(`/knowledgebsae-assistants/${id}`, {
        headers: { Authorization: getToken() },
      })
    ).data;

  const getDocuments = async () =>
    (
      await axios.get(`/documents`, {
        headers: { Authorization: getToken() },
      })
    ).data;
  
    const attachAssistants = async (data) =>
      (
        await axios.post(`/knowledgebase-assistants`, data, {
          headers: { Authorization: getToken() },
        })
      ).data;


    
export const useUploadDocument = () => {
  return useMutation({
    mutationFn: uploadDocument,
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(["document"]);
    },
  });
};


export const useGetDocuments = () =>
  useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
    refetchOnWindowFocus: false,
  });
  export const useGetAttachedAssistants = (id) =>
    useQuery({
      queryKey: ["knowledgebase-assistants", id],
      queryFn: () => getAttachedAssistant(id),
      refetchOnWindowFocus: false,
      enabled: !!id,
  
    });
    export const useAttachAssistants = () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: attachAssistants,
        onSuccess: () => {
          queryClient.invalidateQueries(["assistants"]);
        },
      });
    };