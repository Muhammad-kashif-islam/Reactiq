import React, { useState, useMemo  } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import Pagination from "../../components/Pagination";
import TableHeader from "../../components/TableHeader";
import { Loader } from "../../components/Loader";
import AssistantPopup from "../../components/assistant/AssistantPage.jsx";
import ConfirmationModal from "../../components/forms/ConfirmationModal.jsx";
import { useNavigate } from "react-router";
import { useGetPurchasedNumbers, useReturnNumber } from "../../hooks/phoneNumber.js";
import {formatDateWithTime} from "../../utils/formateDate.js"
const leadsPerPage = 5;

function PhoneNumbers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [numberToReturn, setNumberToReturn] = useState();

  const [showModel, setShowModel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const navigate = useNavigate()
  const {data: numbers, isLoading: isLoadingNumber , isError : isNumberError} = useGetPurchasedNumbers()

  const {mutate : removeNumberApi } = useReturnNumber()

  const buyNumber = () => {
    navigate("/buy-numbers")
  };
  const filteredNumbers = useMemo(() => {
    if (!numbers) return [];
    return numbers.filter(number => 
      number.phone_number.toLowerCase().includes(search.toLowerCase()) ||
      (number.user?.username?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );
  }, [numbers, search]);

  const paginatedNumbers = useMemo(() => {
    const startIndex = (page - 1) * leadsPerPage;
    return filteredNumbers.slice(startIndex, startIndex + leadsPerPage);
  }, [filteredNumbers, page]);

 const handleRemoveNumber = (id) => {
  setNumberToReturn(id)
  setShowDeleteModal(true)
 } 

 const returnNumber = () => {
  removeNumberApi(numberToReturn, {
  onSuccess:() => {
    setShowDeleteModal(false)
  }
 })
 }

 console.log("numbers" , numbers);
 
  return (
    <div className="space-y-8 p-10">

    {showModel && <AssistantPopup setShowModel={setShowModel}/>}
    {!showModel && <>
      <TableHeader
        Headeing="Phone Numbers Table"
        ButtonText="Buy Number"
        showButton={true}
        onButtonClick={buyNumber}

      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search by number..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-64 shadow-inner focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
   
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm ">
        {isLoadingNumber ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 italic">
            <Loader />
          </div>
        ) : isNumberError ? (
          <div className="flex items-center justify-center h-[300px] text-red-500 italic">
            Error loading Numbers. Please try again.
          </div>
        ) : (
          <table className="table-auto min-w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-primary/10 text-primary uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Buyer Name</th>
                <th className="px-5 py-3">Phone Number</th>
                <th className="px-5 py-3">Purchased At</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredNumbers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    No Numbers found 
                  </td>
                </tr>
              ) : (
                filteredNumbers.map((number, index) => (
                  <tr key={number.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-5 py-3">{(page - 1) * leadsPerPage + index + 1}</td>
                    <td className="px-5 py-3 font-medium">{number.user.username}</td>
                    <td className="px-5 py-3 font-medium">{number.phone_number}</td>

                    <td className="px-5 py-3">{formatDateWithTime(number.date_purchased)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3 text-gray-500 ">
                        <button
                          className="text-red-600 transition cursor-pointer"
                          onClick={() => {
                            handleRemoveNumber(number.phone_number);
                          }}
                        >
                          <TbTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {!isLoadingNumber && !isNumberError && filteredNumbers.length !==0  &&(

        <Pagination
          currentPage={page}
          totalItems={filteredNumbers.length}
          itemsPerPage={5}
          onPageChange={setPage}
        />
      )}
           <ConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={returnNumber}
                message="Are you sure you want to return this number? This action cannot be undone"
            />
      </>}
    </div>
  );
}

export default PhoneNumbers;
