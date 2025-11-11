import React from 'react';
import {Loader} from './Loader';
const Button = ({ isPending,buttonText = "Submit" }) => {
  return (
    <>
    {isPending ? (
        <button
          type="submit"
          className="w-full py-3 border-1 bg-primary rounded-full transition duration-200 cursor-pointer"
        >
        <Loader color="border-gray-100" />
        </button>
      ) : (
        <button
          type="submit"
          className="w-full py-3 bg-primary text-white rounded-full hover:bg-indigo-800 transition duration-200 cursor-pointer"
        >
         {buttonText}
        </button>
      )}
      </>
  );
};

export default Button;
