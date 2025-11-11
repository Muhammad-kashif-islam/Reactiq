import { useEffect, useState, useRef } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { IoIosArrowRoundBack } from "react-icons/io";
import {Link, useNavigate } from "react-router";
import LeftContent from "../../components/authentication/LeftContent";
import PopupModal from "../../components/PopupModel";
import { useConfirmOtp } from "../../hooks/auth";
import { handleSuccessToast } from "../../helpers/AsyncHandler";
import toast from "react-hot-toast";
import Button from "../../components/Button";
export default function OTPVerification() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timer, setTimer] = useState(59);
  const { mutateAsync: verifyOtp, isPending } = useConfirmOtp();
  const navigate = useNavigate()
  const inputRefs = useRef([]);
   
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/g, ""); 
    if (!value) return;
    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);

    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
     const email= localStorage.getItem("email");
      if(email){
      verifyOtp(
        {
          email,
          code: enteredOtp,
        },
        {
        onSuccess: (data) => {
          handleSuccessToast(data, "OTP verified successfully");
          localStorage.setItem("code", enteredOtp);
          navigate("/new_password");
        },
      }
      );
    }
    else{
      toast.error("Please enter your email address first.");
    }
    } else {
      setIsModalOpen(true);
    }
  };  

  const handleResend = () => {
    // setOtp(new Array(6).fill(""));
    // setTimer(59);
    navigate("/send_email");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 font-poppins h-full">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden">
       <LeftContent/>

        <div className="w-full md:w-1/2 bg-white p-2 sm:p-10 flex items-center relative">
          <div className="w-full">
          <Link to="/send_email"><IoIosArrowRoundBack
          className="absolute left-0 top-0 text-icon cursor-pointer hidden md:block"
          size={40}
        /></Link>
            <HiOutlineMail className="text-icon bg-[#F1F6FF] rounded-full p-2 text-3xl size-10" />
            <h2 className="text-2xl font-semibold mb-1 text-primary my-4">OTP Verification</h2>
            <p className="text-gray-500 text-sm mb-6 mt-2">
              Check your email to see the verification code
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex gap-3 justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center border border-gray-300 text-xl focus:outline-none focus:border-primary rounded-full"
                  />
                ))}
              </div>

              <Button isPending={isPending} buttonText="Verify"/>

              <p className="text-sm text-gray-500 text-center mt-4">
               
                <span className="text-primary font-semibold">
                  {timer > 0 ? ` Resend code in 00:${timer.toString().padStart(2, "0")}` : (
                    <Link to="/send_email" className="text-primary underline cursor-pointer" onClick={handleResend}>
                      Resend
                    </Link>
                  )}
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      <PopupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Please enter a valid OTP"
        content="Enter a 6 digit OTP in ordre to process"
        primaryButtonText="Ok"
        secondaryButtonText="Cancel"
        onPrimaryButtonClick={()=>{setIsModalOpen(false)}}
      />
    </div>
  );
}
