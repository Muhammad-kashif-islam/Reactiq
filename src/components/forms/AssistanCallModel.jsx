import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { InputField } from "./InputField";
import { Loader } from "../Loader";
import toast from "react-hot-toast";

const CallAssistanModel = ({
  isOpen,
  onClose,
  width = "md",
  title = "Choose Assitant to call",
  isPending = false,
  categoryList = [],
}) => {


  if (!isOpen) return null;
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 backdrop-blur-sm "
        onClick={() => {
          if (!isPending) onClose();
        }}
      />
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className={`relative w-full rounded-lg bg-white shadow-xl transition-all ${widthClasses[width]}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-primary/10">
            <h2 className="text-lg font-semibold text-primary/90">{title}</h2>
            <button
              onClick={() => {
                if (!isPending) onClose();
              }}
              className="text-red-600 hover:text-red-700 focus:outline-none font-extrabold cursor-pointer"
              disabled={isPending}
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-primary/90 text-left">Categories</h3>
            <div className="mt-4 overflow-y-auto">
              <ul className="flex flex-col gap-4">
                {categoryList.map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center justify-between w-full "
                  >
                    <span className="text-sm">{category.name}</span>
                    <div className="flex items-center gap-3 self-end">
                      <button
                        className="text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                        onClick={() => {
                          setCategoryName(category.name);
                          setEditCategory(category);
                        }}
                      >
                        <AiOutlineEdit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <AiOutlineDelete size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallAssistanModel;
