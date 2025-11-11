import { auth, GoogleAuthProvider, signInWithPopup } from "../helpers/firebase";
import axiosInstance from "../helpers/axios"; 
import { toast } from "react-hot-toast";  
import { useNavigate } from "react-router-dom";
function useGoogleLogin(login,navigate) {  
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {   
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const response = await axiosInstance.post("/auth/google", { token });

      const data = response.data;
      if (data.success) {
        toast.success("Logged in successfully!");
        login({ user: data.user, token: data.token });  
        // console.log(data.user.role);
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        }
        else if(data.user.role === "user") {
          navigate("/");
        }
        else {
          toast.error("Invalid user role.");
        }
      } else {
        toast.error(data.detail || "Login failed. Please try again.");
      }

    } catch (error) {
      console.error("Login failed", error);
      const msg = error?.response?.data?.detail || error.message || "Google login failed";
      toast.error(msg);
    }
  };

  return loginWithGoogle;
}

export default useGoogleLogin;
