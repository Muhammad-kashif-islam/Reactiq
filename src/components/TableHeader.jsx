import React from "react";
import { TbPlus } from "react-icons/tb";
import { RiUploadCloud2Line } from "react-icons/ri";
import { TbCategoryMinus } from "react-icons/tb";

function TableHeader({
  Headeing,
  showButton = false,
  ButtonText = "",
  onButtonClick = () => {},
  showSecondButton = false,
  onSecondButtonClick = () => {},
  secondButtonText = "",
  showThirdButton = false,
  thirdButtonText = "",
  onThirdButtonClick = () => {},
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <h2 className="text-3xl font-bold text-primary drop-shadow-sm">
        {Headeing}
      </h2>

      <div className="flex gap-2">
        {showButton && (
          <button
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-pointer"
            onClick={onButtonClick}
          >
            <TbPlus size={20} />
            {ButtonText}
          </button>
        )}
        {showSecondButton && (
          <button
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-pointer"
            onClick={onSecondButtonClick}
          >
            <TbCategoryMinus size={20} />

            {secondButtonText}
          </button>
        )}
        {showThirdButton && (
          <button
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform cursor-pointer"
            onClick={onThirdButtonClick}
          >
            <RiUploadCloud2Line size={20} />

            {thirdButtonText}
          </button>
        )}
      </div>
    </div>
  );
}

export default TableHeader;
