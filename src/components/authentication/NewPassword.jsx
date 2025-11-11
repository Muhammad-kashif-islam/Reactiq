import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { useResetPassword } from "../../hooks/auth";
import Button from "../Button";
import { handleSuccessToast } from "../../helpers/AsyncHandler";

export default function NewPassword({ setSuccess }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  
  const {mutateAsync:resetPassword,isPending} = useResetPassword();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const tempErrors = { ...errors };
    if (formData.password && formData.confirmPassword) {
      tempErrors.password =
        formData.password !== formData.confirmPassword
          ? "Passwords do not match."
          : "";
    } else {
      tempErrors.password = "";
    }

    setErrors(tempErrors);
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const temp = {};

    if (!formData.password) temp.password = "Password is required.";
    if (!formData.confirmPassword)
      temp.confirmPassword = "Confirm password is required.";

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      temp.password = "Passwords do not match.";
    }

    setErrors(temp);

    if (Object.values(temp).every((val) => val === "")) {
     
      resetPassword(
        {
          email: localStorage.getItem("email") || "",
          password: formData.password,
          code: localStorage.getItem("code") || "",
        },
        {
          onSuccess: (data) => {
             handleSuccessToast(data, "Password reset successfully");
             localStorage.removeItem("email");
             localStorage.removeItem("code");
            setSuccess(true);
          },
        }
      );
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-white p-2 sm:p-10 flex items-center relative">
      <div className="w-full">
        <Link to="/otp_verification"><IoIosArrowRoundBack
          className="absolute left-0 top-0 text-icon cursor-pointer hidden md:block"
          size={40}
        /></Link>
        <HiOutlineLockClosed
          className="text-icon bg-[#F1F6FF] rounded-full p-2 text-3xl size-10"
          size={20}
        />
        <h2 className="text-2xl font-semibold mb-1 text-primary my-4">
          Set New Password
        </h2>
        <p className="text-gray-500 text-sm mb-6 mt-2">
          Enter your new password to complete the reset process
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="text-sm font-medium text-gray-600 mb-1">
            New Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed
              className="absolute left-4 top-3.5 text-icon"
              size={20}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-12 pr-10 py-3 rounded-full border ${
                errors.password ? "border-red-500" : "border-primary"
              } focus:outline-none placeholder-gray-400 text-sm`}
            />
            <button
              type="button"
              className="absolute right-4 top-3.5 text-icon cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 ml-3">
                {errors.password}
              </p>
            )}
          </div>

          <label className="text-sm font-medium text-gray-600 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <HiOutlineLockClosed
              className="absolute left-4 top-3.5 text-icon"
              size={20}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-12 pr-10 py-3 rounded-full border ${
                errors.confirmPassword || errors.password
                  ? "border-red-500"
                  : "border-icon"
              } focus:outline-none placeholder-gray-400 text-sm`}
            />
            <button
              type="button"
              className="absolute right-4 top-3.5 text-icon cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 ml-3">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button isPending={isPending} buttonText="Reset Password" />

          <div className="text-center text-sm mt-4 text-[#425583]">
            Remember old password?
            <Link
              to="/login"
              className="text-primary hover:underline font-semibold font-inter ml-1"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
