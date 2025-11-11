import { useEffect, useState } from "react";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineUser
} from "react-icons/hi";
import OtherLogin from "../components/OtherLogin";
import { useSignup } from "../hooks/auth";
import { handleSuccessToast } from "../helpers/AsyncHandler";
import AuthLeftContent from "../components/authentication/AuthLeftContent";
import Button from "../components/Button";
import { useNavigate } from "react-router";
export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const {isPending,mutate:signup} = useSignup();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  useEffect(() => {
    const temp = { ...errors };

    if (touched.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      temp.email = emailRegex.test(formData.email)
        ? ""
        : "Enter a valid email.";
    }

    if (touched.password || touched.confirmPassword) {
      temp.password =
        formData.password === formData.confirmPassword
          ? ""
          : "Passwords do not match.";
    }

    setErrors(temp);
  }, [formData.email, formData.password, formData.confirmPassword, touched,formData.fullName,formData.agree]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const temp = {};

    if (!formData.fullName) temp.fullName = "Full name is required.";
    if (!formData.email) temp.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      temp.email = "Enter a valid email.";

    if (!formData.password) temp.password = "Password is required.";
    if (!formData.confirmPassword)
      temp.confirmPassword = "Confirm password is required.";
    else if (formData.password !== formData.confirmPassword)
      temp.password = "Passwords do not match.";

    if (!formData.agree) temp.agree = "You must agree to terms.";

    setErrors(temp);
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agree: true,
    });

    if (Object.values(temp).every((e) => e === "")) {
      signup({name:formData.fullName,email:formData.email,password:formData.password}, {
          onSuccess: (data) => {
          handleSuccessToast(data, "Verify your email to complete registration");
          localStorage.setItem("enterdEmail", formData.email);
          setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            agree: false,
          });
          setTouched({});
          setErrors({});
          navigate('/email_verification')
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 font-poppins mx-h-screen">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden">
        <AuthLeftContent/>

        <div className="w-full md:w-1/2 p-0 sm:p-10 flex items-center">
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-1 text-primary">Get Started Now</h2>
            <p className="text-gray-500 text-sm mb-6">Let's create your account</p>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-3.5 text-icon" size={20} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  autoComplete="off"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-full border ${errors.fullName ? "border-red-500" : "border-primary"
                    } focus:outline-none placeholder-gray-400 text-sm`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1 ml-3">{errors.fullName}</p>
                )}
              </div>

              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-3.5 text-icon" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="new-email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-full border ${errors.email ? "border-red-500" : "border-primary"
                    } focus:outline-none placeholder-gray-400 text-sm`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-3">{errors.email}</p>
                )}
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-3.5 text-icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Set your password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-10 py-3 rounded-full border ${errors.password ? "border-red-500" : "border-primary"
                    } focus:outline-none placeholder-gray-400 text-sm`}
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-icon cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-3.5 text-icon" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-10 py-3 rounded-full border ${errors.confirmPassword || errors.password ? "border-red-500" : "border-primary"
                    } focus:outline-none placeholder-gray-400 text-sm`}
                />
                <button
                  type="button"
                  className="absolute right-4 top-3.5 text-icon cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1 ml-3">{errors.password}</p>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="accent-primary"
                />
                <span>
                  I agree to <a href="#" className="text-primary font-semibold underline">Term & Condition</a>
                </span>
              </div>
              {errors.agree && (
                <p className="text-red-500 text-sm ml-1">{errors.agree}</p>
              )}

              <Button isPending={isPending} buttonText="Sign Up" />
              <OtherLogin />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
