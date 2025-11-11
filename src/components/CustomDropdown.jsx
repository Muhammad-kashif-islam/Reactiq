import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const CustomDropdown = ({ options, onSelect, defaultText, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  
    const handleSelect = (option) => {
      setSelectedOption(option);
      onSelect(option.value);
      setIsOpen(false);
    };
  
    return (
      <div ref={dropdownRef} className={`relative inline-block ${className}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : defaultText}</span>
          <FiChevronDown
            className={`w-4 h-4 ml-1 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
          />
        </button>
  
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full min-w-[120px] bg-white border border-gray-200 rounded-md shadow-lg">
            <ul className="py-1 overflow-auto max-h-60">
              {options.map((option) => (
                <li
                  key={option.value}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };