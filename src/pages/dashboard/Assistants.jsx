import React, { useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import Pagination from "../../components/Pagination";
import TableHeader from "../../components/TableHeader";
import {
  useDeleteAssistant,
  useGetAssistants,
} from "../../hooks/assistant.js";
import { Loader } from "../../components/Loader";
import AssistantPopup from "../../components/assistant/AssistantPage.jsx";
import ConfirmationModal from "../../components/forms/ConfirmationModal.jsx";
import { useNavigate } from "react-router";

const leadsPerPage = 5;

function Assistants() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [assistantIdToDelete, setAssistantIdToDelete] = useState();

  const [showModel, setShowModel] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const navigate = useNavigate()
  const {data: assistants, isLoading: isLoadingAssistant, isError: isAssistantError} = useGetAssistants();

  const {mutate : deleteAssistantApi } = useDeleteAssistant()

  const addAssistant = () => {
    navigate("/create-assistant")
  };

 

 const handleDeleteAssistant = (id) => {
  setAssistantIdToDelete(id)
  setShowDeleteModal(true)
 } 

 const deleteAssistant = () => {
  deleteAssistantApi(assistantIdToDelete, {
  onSuccess:() => {
    setShowDeleteModal(false)
  }
 })
 }

 const handleUpdateAssistant = async (id) => {
  navigate(`/create-assistant?id=${id}`);
};
const  handleUpdateWorkFlowAssistant = async (id) => {
  navigate(`/workflow?id=${id}`);
};


  return (
    <div className="space-y-8 p-10">

    {showModel && <AssistantPopup setShowModel={setShowModel}/>}
    {!showModel && <>
      <TableHeader
        Headeing="Assistants Table"
        ButtonText="Create Assistant"
        showButton={true}
        onButtonClick={addAssistant}

      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-64 shadow-inner focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
   
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm ">
        {isLoadingAssistant ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 italic">
            <Loader />
          </div>
        ) : isAssistantError ? (
          <div className="flex items-center justify-center h-[300px] text-red-500 italic">
            Error loading Assistants. Please try again.
          </div>
        ) : (
          <table className="table-auto min-w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-primary/10 text-primary uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Assistant Name</th>
                <th className="px-5 py-3">Voice Name</th>
                <th className="px-5 py-3">Created At</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {assistants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    No Assistants found 
                  </td>
                </tr>
              ) : (
                assistants.map((assistant, index) => (
                  <tr key={assistant.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-5 py-3">{(page - 1) * leadsPerPage + index + 1}</td>
                    <td className="px-5 py-3 font-medium">{assistant.title}</td>
                    <td className="px-5 py-3">{assistant.voice}</td>
                    <td className="px-5 py-3">{assistant.created_at}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3 text-gray-500 ">
                        <button
                        onClick={()=> {
                          if(assistant.workflow){
                            handleUpdateWorkFlowAssistant(assistant.id)

                          }else{
                            handleUpdateAssistant(assistant.id)

                          }
                        }
                        
                      }
                          className="text-primary transition cursor-pointer"
                        >
                          <TbEdit size={18} />
                        </button>
                        <button
                          className="text-red-600 transition cursor-pointer"
                          onClick={() => {
                            handleDeleteAssistant(assistant.id);
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
      {!isLoadingAssistant && !isAssistantError && assistants.length !==0  &&(

        <Pagination
          currentPage={page}
          totalItems={assistants.length}
          itemsPerPage={5}
          onPageChange={setPage}
        />
      )}
           <ConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={deleteAssistant}
                message="Are you sure you want to delete this assistant? This action cannot be undone"
            />
      </>}
    </div>
  );
}

export default Assistants;
