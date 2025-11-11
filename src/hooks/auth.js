import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../helpers/axios";
import { useAuth } from "../context/AuthContext";
const signup = async (data) => {
  const response = await axios.post(`/signup`, data);
  console.log("Signup Response:", response.data);
  return response.data;
};
const signin = async (data) => {
  const response = await axios.post(`/signin`, data);
  return response.data;
};

const verifyAccount = async (data) => {
  const response = await axios.post(`/account-verification`, data);
  return response.data;
};

const resendOtp = async (data) => {
  const response = await axios.post(`/resend-otp`, data);
  return response.data;
};

const requestPasswordReset = async (data) => {
  const response = await axios.post(`/password-reset-code`, data);
  // console.log("Password Reset Request Response:", response.data);/
  return response.data;
};

const confirmOtp = async (data) => {
  const response = await axios.post(`/confirm-opt`, data);
  // console.log("Confirm OTP Response:", response.data);
  return response.data;
};

const resetPassword = async (data) => {
  const response = await axios.post(`/reset-password`, data);
  // console.log("Reset Password Response:", response.data);
  return response.data;
};

const updateProfile = async (data) =>
  (
    await axios.post(`/update-profile`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  ).data;

  const updateAdminProfile = async (data) =>
    (
      await axios.post(`/admin-update-profile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    ).data;
const validateToken = async () =>
  (
    await axios.get(`/validate-token`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  ).data;

  const getUserStats = async () =>
    (
      await axios.get(`/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    ).data;
    const getAdminStats = async () =>
      (
        await axios.get(`/admin-stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      ).data;


  const getAdminUserStats = async ({time}) =>
        (
          await axios.get(`/users-stats?period=${time}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        ).data;


const deleteAccount = async () =>
  (
    await axios.delete(`/delete-account`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  ).data;

const getUsers = async () => {
  const res = await axios.get(`/get-all-user`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};
const createUserAccount = async (data) => {
  const response = await axios.post(`/admin-create-user`, data);
  // console.log("Signin Response:", response.data);
  return response.data;
};
const updateUserAccount = async ({id, data}) =>
  (
    await axios.put(`/admin-update-profile/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  ).data
const deleteUserAccount = async (id) =>
  (
    await axios.delete(`/admin-delete-account/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
  ).data;
export const useSignup = () => useMutation({ mutationFn: signup });
export const useSignin = () => useMutation({ mutationFn: signin });
export const useVerifyAccount = () =>
  useMutation({ mutationFn: verifyAccount });
export const useResendOtp = () => useMutation({ mutationFn: resendOtp });
export const useRequestPasswordReset = () =>
  useMutation({ mutationFn: requestPasswordReset });
export const useConfirmOtp = () => useMutation({ mutationFn: confirmOtp });
export const useResetPassword = () =>
  useMutation({ mutationFn: resetPassword });
export const useUpdateProfile = () =>
  useMutation({ mutationFn: updateProfile });

export const useUpdateAdminProfile = () =>
  useMutation({ mutationFn: updateAdminProfile });
export const useDeleteAccount = () =>
  useMutation({ mutationFn: deleteAccount });

export const useGetUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  });
export const useValidateToken = () =>
  useQuery({
    queryKey: ["validateToken"],
    queryFn: validateToken,
    retry: false,
    refetchOnWindowFocus: false,
  });

export const useDeleteUserAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
export const useUpdateUserAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
export const useCreateUserAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
};
export const useLogout = () => {
  const { logout } = useAuth();

  return () => {
    logout();
  };
};
 

export const useGetUserStats = () =>
  useQuery({
    queryKey: ["getuserstats"],
    queryFn: getUserStats,
    retry: false,
    refetchOnWindowFocus: false,
  });


  export const useGetAdminStats = () =>
    useQuery({
      queryKey: ["getAdminstats"],
      queryFn: getAdminStats,
      retry: false,
      refetchOnWindowFocus: false,
    });

    export const useGetAdminUserStats = (time) =>
      useQuery({
        queryKey: ["getAdminUserstats",time],
        queryFn:()=> getAdminUserStats(time),
        retry: false,
        refetchOnWindowFocus: false,
      });
    
    
