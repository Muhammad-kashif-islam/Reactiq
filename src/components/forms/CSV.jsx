import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { SelectField, FileField } from "./InputField";

import { Loader } from "../Loader";
import { useGetCategories, useCreateCSV } from "../../hooks/leads";

const CSVFormModal = ({
  isOpen,
  onClose,
  width = "md",
  title = "Upload CSV Files",
  isPending = false,
  categoryList = [],
}) => {
  const [csvFileName, setcsvFileName] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [errors, setErrors] = useState({
    csvFile: "",
    category: "",
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const {
    data: leadCategories,
    isLoading: isLoadingCategories,
    isError: isCategoryError,
  } = useGetCategories();
  const { mutateAsync: createCSV, isPending: pendingCSV } = useCreateCSV();

  useEffect(() => {
    if (isOpen) {
      setcsvFileName("");
      setCsvFile(null);
      setErrors({
        csvFile: "",
        category: "",
      });
      setSelectedCategoryId(null);
    }
  }, [isOpen]);

  const validate = () => {
    let isValid = true;
    const newErrors = {
      csvFile: "",
      category: "",
    };

    // CSV file validation
    if (!csvFile) {
      newErrors.csvFile = "CSV file is required";
      isValid = false;
    } else if (csvFile && csvFile.type !== "text/csv") {
      newErrors.csvFile = "Selected file must be a CSV file";
      isValid = false;
    } else if (csvFile && csvFile.size > 5 * 1024 * 1024) {
      // 5MB file size limit
      newErrors.csvFile = "File size should not exceed 5MB";
      isValid = false;
    }

    // Category validation
    if (!selectedCategoryId) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setcsvFileName(file.name);

      // Clear error when file is selected
      setErrors((prev) => ({
        ...prev,
        csvFile: "",
      }));
    }
  };

  const handleSelectFileChange = (e) => {
    setSelectedCategoryId(e.target.value);
    // Clear error when category is selected
    setErrors((prev) => ({
      ...prev,
      category: "",
    }));
  };

  const categoryOptions =
    leadCategories?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) || [];

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (validate()) {
        // Create FormData object to handle file upload
        const formData = new FormData();
        formData.append("file", csvFile);
        formData.append("category", selectedCategoryId);
    
        // Debugging: Log the actual FormData contents
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
    
        try {
          await createCSV(formData);
          onClose(); // Close the modal on success
          setCsvFile(null);
          setcsvFileName("");
          setSelectedCategoryId(null);
        } catch (error) {
          console.error("Error uploading CSV:", error);
          // toast.error("Failed to upload CSV");
        }
      }
    };
  const downloadSampleCSV = () => {
    // CSV content with headers and sample data
    const csvContent = `name,email,phone
  John Doe,john.doe@example.com,1234567890,
  Jane Smith,jane.smith@example.com,9876543210,
  Robert Johnson,robert.j@example.com,5551234567,
  Emily Davis,emily.davis@example.com,4445556666,
  Michael Wilson,michael.w@example.com,7778889999`;

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads_sample.csv";
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
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
        className="fixed inset-0 backdrop-blur-sm"
        onClick={() => {
          if (!isPending && !pendingCSV) onClose();
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
                if (!isPending && !pendingCSV) onClose();
              }}
              className="text-red-600 hover:text-red-700 focus:outline-none font-extrabold cursor-pointer"
              disabled={isPending || pendingCSV}
            >
              <AiOutlineClose size={20} />
            </button>
          </div>

          <form
            className="p-6 flex flex-col gap-6 bg-white"
            onSubmit={handleSubmit}
          >
            {/* Add this button above the FileField */}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={downloadSampleCSV}
                className="text-primary border border-primary px-4 py-2 rounded-md hover:bg-primary/10 transition cursor-pointer text-sm"
              >
                Download Sample CSV
              </button>
            </div>

            <FileField
              label="CSV file"
              name="csvFile"
              onChange={handleFileChange}
              error={errors.csvFile}
              accept=".csv"
              required
            />

            {/* Rest of your form remains the same */}
            <SelectField
              label="Select Category"
              name="category"
              value={selectedCategoryId || ""}
              onChange={handleSelectFileChange}
              error={errors.category}
              required
              options={categoryOptions}
            />

            <button
              type="submit"
              disabled={pendingCSV}
              className="mt-4 self-end bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 shadow transition cursor-pointer disabled:opacity-50"
            >
              {pendingCSV ? <Loader /> : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CSVFormModal;
