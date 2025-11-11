import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import useGoogleLogin from "../helpers/LoginWithGoogle";
import { useAuth } from "../context/AuthContext";
export default function OtherLogin({
  action = "Sign up",
  googleLabel = "Sign up with Google",
  linkText = "Already have an account?",
  linkLabel = "Sign in",
  linkTo = "/login",
}) {

  const {login} = useAuth();
  const navigate = useNavigate();
  const loginWithGoogle = useGoogleLogin(login,navigate);
  return (
    <>
      <div className="flex items-center justify-center space-x-4 my-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-gray-500 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <button
        type="button"
        onClick={loginWithGoogle}
        className="w-full flex items-center justify-center space-x-3 border border-primary py-3 rounded-full   transition duration-200 cursor-pointer"
      >
        <FcGoogle size={20} />
        <span>{googleLabel}</span>
      </button>
      <div className="text-center text-sm mt-4 text-[#425583]">
        {linkText}
        <Link
          to={linkTo}
          className="text-primary hover:underline font-semibold font-inter ml-1"
        >
          {linkLabel}
        </Link>
      </div>
    </>
  );
}
