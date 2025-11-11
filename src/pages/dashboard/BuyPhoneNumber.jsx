import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Filter,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Phone,
  Info,
  Check,
} from "lucide-react";
import {
  useAvailableNumbers,
  usePurchaseNumber,
} from "../../hooks/phoneNumber"; 
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router";
export const BuyPhoneNumbers = () => {
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [countryCode, setCountryCode] = useState("US");
  const [page, setPage] = useState(1);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [columnFilter, setColumnFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "number",
    direction: "ascending",
  });


  const [fetchLimit, setFetchLimit] = useState(10);
  const [enabled, setEnabled] = useState(false);
  const countryCodeMapping = {
    US: {
      flag: "🇺🇸",
      name: "United States - US",
      dialCode: "+1",
    },
    HK: {
      flag: "🇭🇰",
      name: "Hong Kong - HK",
      dialCode: "+852",
    },
    GB: {
      flag: "🇬🇧",
      name: "United Kingdom - UK",
      dialCode: "+44",
    },
  };
 const navigate = useNavigate()
  const {
    data: availableNumbersData,
    refetch: fetchNumbers,
    isFetching,
  } = useAvailableNumbers(
    { area_code: countryCode, limit: fetchLimit },
    enabled
  );
  const purchaseNumberMutation = usePurchaseNumber({
    onSuccess: () => {
      setSelectedNumbers([]);
      navigate("/phone-number");
    }
  });

  useEffect(() => {
    if (availableNumbersData) {
      setNumbers(availableNumbersData);
      setSelectedNumbers([]);
    }
  }, [availableNumbersData]);

  const handleSearchClick = async () => {
    try {
      setEnabled(true);
      await fetchNumbers();
      setColumnFilter("");
      setFilterModalOpen(false);
    } catch (error) {
      console.error("Error fetching numbers:", error);
    } finally {
      setEnabled(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const handleNumberSelection = (phoneNumber) => {
    setSelectedNumbers(prev => {
      if (prev.includes(phoneNumber)) {
        return prev.filter(num => num !== phoneNumber);
      } else {
        return [...prev, phoneNumber];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedNumbers.length === numbers.length) {
      setSelectedNumbers([]);
    } else {
      setSelectedNumbers(numbers.map(number => number.phone_number));
    }
  };




  const handleResetFilters = () => {
    setColumnFilter("");
    setFilterModalOpen(false);
    setSortConfig({ key: "number", direction: "ascending" });
    setFetchLimit(10);
    setNumbers([]);
    setSelectedNumbers([]);
  };

  const handlePurchaseNumbers = async () => {
    if (selectedNumbers.length === 0) return;
    
    try {
      await purchaseNumberMutation.mutateAsync({ phone_numbers: selectedNumbers },{
        onSuccess(){
          navigate("/phone-numbers")
          setSelectedNumbers([]);
        }
      });
    } catch (error) {
      console.error("Error purchasing numbers:", error);
    }
  };


  const numbersFilter = numbers.slice(
    (page - 1) * 5,
    page * 5
  );

  return (
    <div className="max-w-7xl mt-10">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-lg">
        <div className="p-6 pb-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Phone className="mr-2 h-6 w-6 text-[#4C178F]" />
              Buy a Number
            </h1>
            {selectedNumbers.length > 0 && (
              <button
                onClick={handlePurchaseNumbers}
                disabled={purchaseNumberMutation.isLoading}
                className="px-4 py-2 bg-[#4C178F] text-white rounded-md hover:bg-[#3a1169] text-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
              >
                {purchaseNumberMutation.isLoading ? (
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                {purchaseNumberMutation.isLoading
                  ? "Purchasing..."
                  : `Purchase ${selectedNumbers.length} Selected`}
              </button>
            )}
          </div>

          {/* Filters Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#4C178F]/20 focus-within:border-[#4C178F]">
                    <div className="pl-3 pr-2 py-2 flex items-center">
                      <span className="text-lg mr-1">
                        {countryCodeMapping[countryCode].flag}
                      </span>
                    </div>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="flex-grow py-2 pl-1 pr-8 border-0 bg-transparent focus:ring-0 focus:outline-none text-sm appearance-none"
                    >
                      {Object.entries(countryCodeMapping).map(
                        ([code, details]) => (
                          <option key={code} value={code}>
                            ({details.dialCode}) {details.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Limit Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Results
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={fetchLimit}
                    onChange={(e) => {
                      const newLimit = Math.max(
                        1,
                        Math.min(1000, Number(e.target.value))
                      );
                      setFetchLimit(newLimit);
                    }}
                    min="1"
                    max="1000"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm pr-16 focus:ring-2 focus:ring-[#4C178F]/20 focus:border-[#4C178F]"
                    placeholder="Enter number of results"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-gray-500">Max: 1000</span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Set the number of results to fetch. Default is 10.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pb-6">
              <button
                onClick={handleSearchClick}
                disabled={isFetching}
                className="px-4 py-2 bg-[#4C178F] text-white rounded-md hover:bg-[#3a1169] text-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
              >
                {isFetching ? (
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {isFetching ? "Searching..." : "Search"}
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center transition-colors cursor-pointer"
              >
                <RefreshCw className="h-4 w-4 mr-2 text-[#4C178F]" />
                Reset Filters
              </button>
            </div>

            {/* Numbers Table */}
            <div className="overflow-x-auto border-t border-gray-200 pb-4">
              <table className="table-auto min-w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-primary/10 text-primary uppercase text-xs tracking-wider">
                  <tr>
                    {/* Checkbox Column */}
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedNumbers.length === numbers.length && numbers.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-[#4C178F] focus:ring-[#4C178F] border-gray-300 rounded"
                      />
                    </th>
                    
                    {/* Number Column */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSort("phone_number")}
                          className="hover:text-gray-700 transition-colors"
                          aria-label="Sort by number"
                        >
                          {sortConfig.key === "phone_number" &&
                          sortConfig.direction === "ascending" ? (
                            <ArrowUp className="h-4 w-4 text-[#4C178F]" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        NUMBER
                        {/* Filter modal section */}
                        <div className="relative">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFilterModalOpen((prev) => !prev);
                              }}
                              className="hover:text-gray-700 transition-colors"
                              aria-label="Filter numbers"
                            >
                              <Filter className="h-4 w-4 text-gray-500" />
                            </button>
                            {filterModalOpen && (
                              <div
                                className="absolute z-50 top-full left-0 mt-2 w-64 bg-white border rounded-md shadow-lg p-3"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="text-xs font-medium text-gray-700 mb-2">
                                  Filter by Number
                                </div>
                                <input
                                  type="text"
                                  value={columnFilter}
                                  onChange={(e) =>
                                    setColumnFilter(e.target.value)
                                  }
                                  placeholder="Enter digits to filter..."
                                  className="border rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-[#4C178F]/20 focus:border-[#4C178F]"
                                  autoFocus
                                />
                              </div>
                            )}
                          </div>

                          {/* Add a global click listener to close the modal when clicking outside */}
                          {filterModalOpen && (
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setFilterModalOpen(false)}
                            />
                          )}
                        </div>
                      </div>
                    </th>

                    {/* Type Column */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      COUNTRY
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {isFetching ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <RotateCw className="h-8 w-8 text-[#4C178F] animate-spin mb-2" />
                          <p className="text-sm text-gray-500">
                            Loading numbers...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : !numbers ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Info className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Click "Search" to find available numbers
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : numbersFilter.length > 0 ? (
                    numbersFilter.map((number, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[#f8f5fc] transition-colors"
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedNumbers.includes(number.phone_number)}
                            onChange={() => handleNumberSelection(number.phone_number)}
                            className="h-4 w-4 text-[#4C178F] focus:ring-[#4C178F] border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="font-mono">{number.phone_number}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-default">
                          {number.iso_country}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Info className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            No numbers found. Try adjusting your search or
                            filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {numbers.length !== 0 && (
              <Pagination
                currentPage={page}
                totalItems={numbers.length}
                itemsPerPage={5}
                onPageChange={setPage}
              />
              )}
     
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};