import React from 'react'
import singInImage from "../../assets/singinbg.png";
import lock from "../../assets/forgetpassword.png";
export default function LeftContent({title='Recover', subtitle='Your Password'}) {
  return (
    <div
    className=" hidden sm:flex relative md:w-1/2 w-full flex-col justify-between bg-cover bg-center text-white py-10 px-2 md:px-10 h-[600px]"
    style={{
      backgroundImage: `url(${singInImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-light mt-2">
        {subtitle}
      </h1>
    </div>
    <div className="flex items-center justify-center h-full absolute inset-0">
      <img
        src={lock}
        alt="Lock Icon"
        className="max-w-[80%] max-h-[80%] object-contain"
      />
    </div>
  </div>
  )
}
