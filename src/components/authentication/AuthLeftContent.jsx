import React from "react";
import singInImage from "../../assets/singinbg.png";
import singinBototmimage from "../../assets/singinbgbottom.png";
import commenticon from "../../assets/commenticon.png";

export default function AuthLeftContent() {
  return (
    <div
      className="relative md:w-1/2 w-full flex flex-col justify-between bg-cover bg-center text-white py-10 pl-2 md:pl-10"
      style={{
        backgroundImage: `url(${singInImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold">Start Your</h2>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-light mt-2">
          Journey with Us
        </h1>
      </div>

      <div className="relative z-10 mt-10">
        <div className="flex items-start gap-2 max-w-sm mx-auto">
          <img src={commenticon} alt="Comment Icon" className="w-6 h-6 mt-1" />
          <p className="text-xs leading-relaxed">
            AI-powered voice agent for seamless, natural, & efficient customer
            interactions and support.
          </p>
        </div>
        <img
          src={singinBototmimage}
          alt="Bottom Graphic"
          className="w-full max-w-[120%] md:max-w-[140%] absolute bottom-0 right-0 translate-y-1/3 md:translate-y-1/4 hidden lg:block"
        />
      </div>
    </div>
  );
}
