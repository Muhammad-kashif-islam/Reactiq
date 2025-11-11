import React from "react";
import { useGetPurchasedNumbers } from "../../hooks/phoneNumber.js";
import Select from "react-select";

const PhoneNumber = ({ handleChange, assistantData }) => {
  const { data: numbers, isLoading: isLoadingNumber, isError: isNumberError } = useGetPurchasedNumbers();  
  const [selectedNumbers, setSelectedNumbers] = React.useState(assistantData.phone_numbers || []);

  React.useEffect(() => {
    setSelectedNumbers(assistantData.phone_numbers || []);
  }, [assistantData.phone_numbers]);

  const handleMultiselectChange = (selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    
    setSelectedNumbers(selectedValues);
    handleChange("phone_numbers", selectedValues); 
  };

  if (isLoadingNumber) {
    return <div>Loading phone numbers...</div>;
  }

  if (isNumberError) {
    return <div>Error loading phone numbers!</div>;
  }

  // Transform fetched numbers into the format expected by Select
  const options = numbers.map(number => ({
    label: number.phone_number,
    value: number.phone_number,
  }));

  return (
    <div>
      <label htmlFor="Phone Numbers" className="block text-sm font-medium text-gray-700 mb-2">
        Phone Numbers
      </label>
      <div className="relative">
        <Select
          isMulti
          options={options}
          value={options.filter(option => selectedNumbers.includes(option.value))}
          onChange={handleMultiselectChange}
          placeholder="Select Phone Numbers"
        />
      </div>
    </div>
  );
};

export default PhoneNumber;
