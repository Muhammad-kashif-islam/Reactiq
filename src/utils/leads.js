const getFormFields = (categoryOptions) => [
  [
    { name: "name", label: "First Name", required: true, type: "input" },
    { 
      name: "email", 
      label: "Email", 
      required: true, 
      type: "input",
      validate: (value) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address";
        }
        return null;
      }
    },
  ],
  [
    {
      name: "phone",
      label: "Phone (International Format)",
      type: "input",
      required: true,
      validate: (value) => {
        // Remove all non-digit characters except +
        const cleaned = value.replace(/[^\d+]/g, '');
        
        // Check if it starts with + and has 7-15 digits after
        if (!/^\+\d{7,15}$/.test(cleaned)) {
          return "Phone must be in international format (e.g., +1 (443) 562-1524)";
        }
        return null;
      },
      placeholder: "+1 (123) 456-7890",
    },
  ],
  [
    {
      name: "category",
      label: "Category",
      type: "select",
      options: categoryOptions,
      required: true,
    },
  ],
];

export { getFormFields };