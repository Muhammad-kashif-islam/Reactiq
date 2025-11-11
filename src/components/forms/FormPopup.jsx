import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { InputField, SelectField, FileField } from './InputField';
import { Loader } from '../Loader';

const fieldComponents = {
  input: InputField,
  select: SelectField,
  file: FileField,
};

const GenericFormModal = ({
  isOpen,
  onClose,
  width = 'md',
  fields = [],
  onSubmit,
  title,
  isPending = false,
  initialValues = {}, 
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initialData = {};
      fields.flat().forEach((field) => {
        initialData[field.name] =
          initialValues[field.name] ?? field.defaultValue ?? '';
      });
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, fields, initialValues]);

  const validate = () => {
    const newErrors = {};
    fields.flat().forEach(({ name, label, required, validate }) => {
      const value = formData[name];
      if (required && !value) {
        newErrors[name] = `${label || name} is required`;
      } else if (validate) {
        const validationResult = validate(value);
        if (validationResult) {
          newErrors[name] = validationResult;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    const fieldValue = type === 'file' ? files[0] : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 backdrop-blur-md bg-black/20"
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
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
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
          <form className="p-6 flex flex-col gap-6 bg-white" onSubmit={handleSubmit}>
            {fields.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-col sm:flex-row gap-4">
                {row.map((field) => {
                  const FieldComponent = fieldComponents[field.type || 'input'];
                  return (
                    <FieldComponent
                      key={field.name}
                      {...field}
                      value={formData[field.name]}
                      onChange={handleChange}
                      error={errors[field.name]}
                    />
                  );
                })}
              </div>
            ))}

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 self-end bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 shadow transition cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader /> : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GenericFormModal;
