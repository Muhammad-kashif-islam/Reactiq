import React, { useState, useEffect } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const DynamicInputFields = ({ handleChange, assistantData }) => {
  // Initialize fields from assistantData or with one empty field
  const [fields, setFields] = useState(
    assistantData.data_needed?.length > 0 
      ? assistantData.data_needed.map(item => ({
          id: Date.now() + Math.random(),
          title: item.title || "",
          description: item.description || ""
        }))
      : [{ id: Date.now(), title: "", description: "" }]
  );

  // Update parent state whenever fields change
  useEffect(() => {
    const dataNeeded = fields.map(({ id, ...rest }) => rest);
    handleChange("data_needed", dataNeeded);
  }, [fields]);

  const handleAddField = () => {
    const newField = { 
      id: Date.now(), 
      title: "", 
      description: "" 
    };
    setFields([...fields, newField]);
  };

  const handleInputChange = (id, field, value) => {
    const updatedFields = fields.map((fieldObj) =>
      fieldObj.id === id ? { ...fieldObj, [field]: value } : fieldObj
    );
    setFields(updatedFields);
  };

  const handleDeleteField = (id) => {
    if (fields.length > 1) {
      const updatedFields = fields.filter((fieldObj) => fieldObj.id !== id);
      setFields(updatedFields);
    }
  };

  return (
    <div className="py-4">
      <div className="space-y-4 w-full mx-auto">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center rounded-lg bg-white border border-gray-200 p-4"
          >
            <div className="flex-grow w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Title {index + 1}
              </label>
              <input
                type="text"
                value={field.title}
                onChange={(e) =>
                  handleInputChange(field.id, "title", e.target.value)
                }
                className="w-full h-10 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                placeholder="Enter field title"
              />
            </div>
            
            <div className="flex-grow w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={field.description}
                onChange={(e) =>
                  handleInputChange(field.id, "description", e.target.value)
                }
                className="w-full h-10 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                placeholder="Short description"
              />
            </div>
            
            {fields.length > 1 && (
              <button
                onClick={() => handleDeleteField(field.id)}
                className="mt-2 sm:mt-6 p-2 text-red-700 hover:text-red-800 focus:outline-none transition-colors"
                aria-label="Delete field"
              >
                <FaTrashAlt className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={handleAddField}
          className="mt-4 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors flex items-center justify-center mx-auto"
        >
          <FaPlus className="mr-2" />
          Add Field
        </button>
      </div>
    </div>
  );
};

export default DynamicInputFields;