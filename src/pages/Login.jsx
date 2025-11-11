import { useState } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import OtherLogin from "../components/OtherLogin";
import { useSignin } from "../hooks/auth";
import { handleSuccessToast } from "../helpers/AsyncHandler";
import { Loader } from "../components/Loader";
import Button from "../components/Button";
import AuthLeftContent from "../components/authentication/AuthLeftContent";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false); 
  const { isPending, mutate: signin } = useSignin();
  const navigate = useNavigate();

  const { login } = useAuth();



  const handleSubmit = (e) => {
    e.preventDefault();
    const tempErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    tempErrors.email = email
      ? emailRegex.test(email)
        ? ""
        : "Enter a valid email address."
      : "Email is required.";
    tempErrors.password = password ? "" : "Password is required.";

    setErrors(tempErrors);
    if (Object.values(tempErrors).every((e) => e === "")) {
      signin(
        { email, password },
        {
          onSuccess: (data) => {


            if (data.verify !== undefined && data.verify === false) {
              localStorage.setItem("enterdEmail", email);
              handleSuccessToast(data, "Email verification code sent to your email");
              navigate("/email_verification");
            } else {
              handleSuccessToast(data, "Login successful");
              login(data);
              if (rememberMe) {
                localStorage.setItem("email", email);
                localStorage.setItem("password", password);
              } else {
                localStorage.removeItem("email");
                localStorage.removeItem("password");
              }
              setEmail("");
              setPassword("");
              if (data.user.role === "admin") {
                navigate("/admin/dashboard");
              } else {
                navigate("/dashboard");
              }
            }
          }
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 font-poppins mx-h-screen 3xl:bg-red-600">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden">
        <AuthLeftContent />

        <div className="w-full md:w-1/2 bg-white p-2 sm:p-10 flex items-center z-20">
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-1 text-primary">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <HiOutlineMail
                  className="absolute left-4 top-3.5 text-icon"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-full border ${
                    errors.email ? "border-red-500" : "border-primary"
                  } focus:outline-none placeholder-gray-400 text-sm`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-3">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="relative">
                <HiOutlineLockClosed
                  className="absolute left-4 top-3.5 text-icon"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-10 py-3 rounded-full border ${
                    errors.password ? "border-red-500" : "border-primary"
                  } focus:outline-none placeholder-gray-400 text-sm`}
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-primary hover:text-indigo-800 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiOutlineEyeOff size={20} className="text-icon" />
                  ) : (
                    <HiOutlineEye className="text-icon" size={20} />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 ml-3">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center text-sm px-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="accent-primary"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/send_email" className="text-primary hover:underline">
                  Forgot Password
                </Link>
              </div>

              <Button isPending={isPending} buttonText="Sign In" />
              <OtherLogin
                linkText="Don't have an account?"
                linkLabel="Sign Up"
                linkTo="/signup"
                googleLabel="Sign in with Google"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
