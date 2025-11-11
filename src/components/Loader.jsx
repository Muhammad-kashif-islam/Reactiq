import React from "react";

const Loader = ({ color = "border-gray-400", size = 6 }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-2 border-t-transparent ${color}`}
      ></div>
    </div>
  );
};
const LoaderFull = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-16 h-16 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
  </div>
);
export {Loader,LoaderFull};
