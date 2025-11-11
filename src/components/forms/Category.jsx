import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { InputField } from "./InputField";
import { Loader } from "../Loader";
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../../hooks/leads";
import toast from "react-hot-toast";
import PopupModal from "../PopupModel";

const CategoryFormModal = ({
  isOpen,
  onClose,
  width = "md",
  title = "Manage Categories",
  isPending = false,
  categoryList = [],
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [errors, setErrors] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { mutateAsync: createCategory, isPending: pendingCreate } =
    useCreateCategory();
  const { mutateAsync: deleteCategory, isPending: pendingDelete } =
    useDeleteCategory();
  const { mutateAsync: updateCategory, isPending: pendingUpdate } =
    useUpdateCategory();

  useEffect(() => {
    if (isOpen) {
      setCategoryName("");
      setErrors("");
      setEditCategory(null);
    }
  }, [isOpen]);

  const validate = () => {
    if (!categoryName) {
      setErrors("Category name is required");
      return false;
    }
    setErrors("");
    return true;
  };

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (editCategory) {
        await handleEditCategory(editCategory.id, categoryName);
      } else {
        await handleAddCategory(categoryName);
      }
      setCategoryName("");
    }
  };

  const handleAddCategory = async (name) => {
    await createCategory({ name });
  };

  const handleEditCategory = async (id, newName) => {
    if (!id || !newName) {
      toast.success("Name or id is missing");
      return;
    }
    await updateCategory({ id, data: newName },{
      onSuccess:(re)=>{
        setEditCategory(null);
        // selectedCategoryId(null);
      }
    });
  };

  const handleDeleteCategory = async () => {
    await deleteCategory(selectedCategoryId);
    setEditCategory(null);
    setSelectedCategoryId(null);
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

          <form
            className="p-6 flex flex-col gap-6 bg-white"
            onSubmit={handleSubmit}
          >
            <InputField
              label="Category Name"
              name="categoryName"
              value={categoryName}
              onChange={handleChange}
              error={errors}
              required
              placeholder="Enter category name"
            />

            <button
              type="submit"
              disabled={pendingCreate || pendingUpdate}
              className="mt-4 self-end bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 shadow transition cursor-pointer disabled:opacity-50"
            >
              {pendingCreate || pendingUpdate ? (
                <Loader />
              ) : editCategory ? (
                "Update"
              ) : (
                "Add"
              )}
            </button>
          </form>

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

      <PopupModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Category"
        content="Are you sure you want to delete this Category?"
        onPrimaryButtonClick={() => {
          handleDeleteCategory();
          setShowDeleteModal(false);
          setSelectedCategoryId(null);
        }}
        onSecondaryButtonClick={() => {
          setShowDeleteModal(false);
          setSelectedCategoryId(null);
        }}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        primaryButtonVariant="danger"
      />
    </div>
  );
};

export default CategoryFormModal;
