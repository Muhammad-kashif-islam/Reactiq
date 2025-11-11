import { useEffect, useState } from "react";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import LeftContent from "../../components/authentication/LeftContent";
import { useRequestPasswordReset } from "../../hooks/auth";
import { handleSuccessToast } from "../../helpers/AsyncHandler";
import { Loader } from "../../components/Loader";
import Button from "../../components/Button";
export default function SendEmail() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const { mutateAsync: sendCode, isPending } = useRequestPasswordReset();
  const navigate = useNavigate();
  useEffect(() => {
    const tempErrors = { ...errors };
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      tempErrors.email = emailRegex.test(email)
        ? ""
        : "Enter a valid email address.";
    }
    setErrors(tempErrors);
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    tempErrors.email = email
      ? emailRegex.test(email)
        ? ""
        : "Enter a valid email address."
      : "Email is required.";
    setErrors(tempErrors);
    if (Object.values(tempErrors).every((e) => e === "")) {
      sendCode(
        {
          email,
        },
        {
          onSuccess: (data) => {
            handleSuccessToast(data, "Email sent successfully");
            localStorage.setItem("email", email);
            navigate("/otp_verification");
          },
          onError: (error) => {
            // console.log(error);
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 font-poppins h-full">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden ">
        <LeftContent />

        <div className="w-full md:w-1/2 bg-white p-2 sm:p-10 flex items-center relative">
          <div className="w-full">
            <Link to="/login">
              <IoIosArrowRoundBack
                className="absolute left-0 top-0 text-icon cursor-pointer hidden md:block"
                size={40}
              />
            </Link>{" "}
            <HiOutlineLockClosed
              className="text-icon bg-[#F1F6FF] rounded-full p-2 text-3xl size-10"
              size={20}
            />
            <h2 className="text-2xl font-semibold mb-1 text-primary my-4">
              Forget Password?
            </h2>
            <p className="text-gray-500 text-sm mb-6 mt-2">
              Enter your email to reset your password
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
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
              <Button isPending={isPending} buttonText="Send Code" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
