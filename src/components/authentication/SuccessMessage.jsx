import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";
export default function SuccessMessage() {
  return (
    <div className="w-full md:w-1/2 bg-white p-2 sm:p-10 flex flex-col justify-center items-center sm:items-start relative">
      <Link to="/otp_verification"><IoIosArrowRoundBack
                className="absolute left-0 top-0 text-icon cursor-pointer hidden md:block"
                size={40}
              /></Link>
      <IoCheckmarkCircle
        className="text-green-500  text-3xl size-12"
        size={20}
      />
      <h2 className="text-2xl hidden sm:flex font-semibold mb-1 text-primary my-4">
        Your Password <br />
        Successfully Changed
      </h2>
      <h2 className="flex sm:hidden text-2xl font-semibold mb-1 text-primary my-4 text-centers px-6 text-center">
        Your Password 
        Successfully Changed
      </h2>
      <p className="text-gray-500 text-sm mb-6 mt-2">
        Sign in to your account with your new password
      </p>
      <Link
        to="/login"
        className="w-32 sm:w-full py-3 bg-primary text-white rounded-full hover:bg-indigo-800 transition duration-200 cursor-pointer text-center"
      >
        Sign in
      </Link>
    </div>
  );
}
