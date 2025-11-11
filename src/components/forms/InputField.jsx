import React from "react";

export const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder = "",
}) => (
  <div className="flex flex-col w-full">
    {label && (
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 mb-1 text-left"
      >
        {label}
      </label>
    )}
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      autoComplete="off"
      className={`w-full border text-sm rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none ${
        error ? "border-red-500" : "border-primary/50 "
      }`}
    />
    {error && <p className="text-sm text-red-600 mt-1 text-left">{error}</p>}
  </div>
);

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  options = [],
}) => (
  <div className="flex flex-col w-full">
    {label && (
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 mb-1 text-left"
      >
        {label}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full border text-sm rounded-lg px-3 py-2 focus:outline-none ${
        error ? "border-red-500" : "border-primary/50"
      }`}
    >
      <option value="">Select...</option>
      {Array.isArray(options) && options.length > 0 ? (
        options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))
      ) : (
        <option value="" disabled>
          No options available
        </option>
      )}
    </select>
    {error && <p className="text-sm text-left text-red-600 mt-1">{error}</p>}
  </div>
);

export const FileField = ({
  label,
  name,
  onChange,
  error,
  required = false,
}) => (
  <div className="flex flex-col w-full">
     {label && (
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 mb-1 text-left"
      >
        {label}
      </label>
    )}
    <input
      id={name}
      name={name}
      type="file"
      onChange={onChange}
      className={`w-full text-sm rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-primary file:text-white hover:file:bg-primary/90 ${
        error ? "border-red-500" : "border-primary/50"
      }`}
    />
    {error && <p className="text-sm text-left text-red-600 mt-1">{error}</p>}
  </div>
);
