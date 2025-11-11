import React, { useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import Pagination from "../../components/Pagination";
import TableHeader from "../../components/TableHeader";
import GenericFormModal from "../../components/forms/FormPopup";
import {
  useCreateLead,
  useDeleteLead,
  useGetCategories,
  useGetLeads,
  useLeadCall,
  useUpdateLead,
} from "../../hooks/leads";
import { handleSuccessToast } from "../../helpers/AsyncHandler";
import PopupModal from "../../components/PopupModel";
import { Loader } from "../../components/Loader";
import { getFormFields } from "../../utils/leads";
import CategoryFormModal from "../../components/forms/Category";
import CSVFormModal from "../../components/forms/CSV";
import { IoCall, IoCallOutline } from "react-icons/io5";
import { FcPhone } from "react-icons/fc";

import {useGetAssistants} from "../../hooks/assistant.js";

const leadsPerPage = 5;

function Leads() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [showModel, setShowModel] = useState(false);
  const [formFields, setFormFields] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
 const [loading , setLoading] = useState(false)
  const {
    data: leadCategories,
    isLoading: isLoadingCategories,
    isError: isCategoryError,
  } = useGetCategories();
  const {
    data: leads,
    isLoading: isLoadingLeads,
    isError: isLeadsError,
  } = useGetLeads();

  const { mutateAsync: createLead, isPending } = useCreateLead();
  const { mutateAsync: leadCall } = useLeadCall();

  const { mutateAsync: leadDelete } = useDeleteLead();

  const { mutateAsync: updateLead } = useUpdateLead();

  const {data: assistants,isLoading: AssistantLoading} = useGetAssistants();
  console.log("assistants",setLoading);
  

  const filteredLeads = leads
    ? leads.filter(
        (lead) =>
          (category === "All" || lead.category.name === category) &&
          lead.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const paginatedLeads = filteredLeads.slice(
    (page - 1) * leadsPerPage,
    page * leadsPerPage
  );

  const categoryOptions =
    leadCategories?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) || [];

  const uniqueCategories = [
    "All",
    ...new Set(leads?.map((l) => l.category.name) || []),
  ];

  const addLead = () => {
    if (!isLoadingCategories && !isCategoryError) {
      setFormFields(getFormFields(categoryOptions));
      setIsEditing(false);
      setEditLead(null);
      setShowModel(true);
    }
  };

  const submitForm = async (data) => {
    const payload = {
      ...data,
      category: data.category,
    };

    if (isEditing && editLead?.id) {
      updateLead({ id: editLead.id, data: payload });
      console.log("Updating lead:", editLead.id, payload);
    } else {
      await createLead(payload, {
        onSuccess: (res) => {
          handleSuccessToast(res, "Lead created successfully");
        },
      });
    }

    setShowModel(false);
    setEditLead(null);
    setIsEditing(false);
  };

  const deleteLead = async (leadId) => {
    await leadDelete(leadId, {
      onSuccess: (res) => {
        handleSuccessToast(res, "Lead deleted successfully");
        setShowDeleteModal(false);
      },
    });
  };

  const handleEditClick = (lead) => {
    const categoryId = leadCategories.find(
      (c) => c.name === lead.category.name
    )?.id;

    setFormFields(getFormFields(categoryOptions));
    setEditLead({
      ...lead,
      category: categoryId,
    });
    setIsEditing(true);
    setShowModel(true);
  };
  // const addCategory = () => {
  //   setFormFields([
  //     [{ name: "name", label: "Category Name", required: true, type: "input" }],
  //   ]);
  //   setIsEditing(false);
  //   setEditLead(null);
  //   setShowModel(true);
  // };
  
  const handleCloseAssitantModal = () => {
    setModalVisible(false);
    setSelectedAssistant(null);
  };


  const handleCall = async () => {
    const payload = {
      to_number:selectedLead,
      assistant_id: Number(selectedAssistant),
    };

  
    await leadCall(payload, {
      onSuccess: () => {
        setModalVisible(false); 
        setSelectedAssistant(null);
        setSelectedLead(null); 
      },
    });
   
    
  };


  const handleCallModal = (lead) => {
    setSelectedLead(lead.phone);
    setModalVisible(true);
  };
  return (
    <div className="space-y-8 p-10">
      <TableHeader
        Headeing="Leads Table"
        ButtonText="Add New Lead"
        showButton={true}
        onButtonClick={addLead}
        showSecondButton={true}
        secondButtonText="Categories"
        onSecondButtonClick={() => setShowCategoryModal(true)}
        showThirdButton={true}
        thirdButtonText="Upload CSV"
        onThirdButtonClick={() => setShowCSVModal(true)}
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
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-md px-4 py-2 shadow-inner focus:outline-none"
        >
          {uniqueCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm ">
        {isLoadingLeads ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 italic">
            <Loader />
          </div>
        ) : !leads || leads.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 italic">
            No leads found
          </div>
        ) : (
          <table className="table-auto min-w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-primary/10 text-primary uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No leads found
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3">
                      {(page - 1) * leadsPerPage + index + 1}
                    </td>
                    <td className="px-5 py-3 font-medium">{lead.name}</td>
                    <td className="px-5 py-3">{lead.email}</td>
                    <td className="px-5 py-3">{lead.phone}</td>
                    <td className="px-5 py-3">{lead.category.name}</td>
              
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3 text-gray-800 ">
                      <button onClick={() => handleCallModal(lead)} className=" xl:mr-2 cursor-pointer hover:underline" aria-placeholder="CALL"> <IoCall /> </button>
                        <button
                          className="text-primary transition cursor-pointer"
                          onClick={() => handleEditClick(lead)}
                        >
                          <TbEdit size={18} />
                        </button>
                        <button
                          className="text-red-600 transition cursor-pointer"
                          onClick={() => {
                            setShowDeleteModal(true);
                            setSelectedLeadId(lead.id);
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
      {modalVisible && (
            <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/50 min-h-screen flex justify-center items-center px-2 z-50">
              <div className="bg-white p-10 rounded-lg shadow-lg max-w-xl w-full">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Select Assistant</h2>
                <div className="flex flex-col space-y-6">
                  <div className="flex flex-col">
                    <label htmlFor="assistantSelect" className="mb-2 text-gray-600 font-medium">
                      Select an Assistant
                    </label>
                    <select
                      id="assistantSelect"
                      className="p-3 border border-gray-300 rounded-lg text-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={selectedAssistant || ''}
                      onChange={(e) => setSelectedAssistant(e.target.value)}
                    >
                      <option value="" disabled>
                        Choose an assistant...
                      </option>
                      {!AssistantLoading ?
                      
                      (assistants.map((assistant) => (
                        <option key={assistant.id} value={assistant.id}>
                          {assistant.title}
                        </option>
                      ))) :(
                        <p>Assistants are loading.....</p>
                      )}
                    </select>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      className="px-7 py-2 bg-primary text-white rounded hover:bg-primary-dark transition duration-200"
                      onClick={handleCall}
                      disabled={!selectedAssistant || loading}
                    >
                      {loading ? "Calling..." : 'Call'}
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-200"
                      onClick={handleCloseAssitantModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      {!isLoadingLeads && !isLeadsError && paginatedLeads.length !== 0 && (
        <Pagination
          currentPage={page}
          totalItems={filteredLeads.length}
          itemsPerPage={leadsPerPage}
          onPageChange={setPage}
        />
      )}

      <GenericFormModal
        isOpen={showModel}
        onClose={() => {
          setShowModel(false);
          setEditLead(null);
          setIsEditing(false);
        }}
        title={isEditing ? "Edit Lead" : "Add New Lead"}
        onSubmit={submitForm}
        fields={formFields}
        initialValues={editLead || {}}
        isPending={isPending}
      />
      <CategoryFormModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categoryList={leadCategories}
      />
      <CSVFormModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        categoryList={leadCategories}
      />
      <PopupModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Lead"
        content="Are you sure you want to delete this lead?"
        onPrimaryButtonClick={() => {
          deleteLead(selectedLeadId);
          setShowDeleteModal(false);
          setSelectedLeadId(null);
        }}
        onSecondaryButtonClick={() => {
          setShowDeleteModal(false);
          setSelectedLeadId(null);
        }}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        primaryButtonVariant="danger"
      />
    </div>
  );
}

export default Leads;
