import React, { useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import Pagination from "../../components/Pagination";
import TableHeader from "../../components/TableHeader";
import PopupModal from "../../components/PopupModel";
import { Loader } from "../../components/Loader";
import { handleSuccessToast } from "../../helpers/AsyncHandler";
import {
  useDeleteAssistant,
  useGetAssistants,
  useCreateAssistant,
  useUpdateAssistant,
} from "../../hooks/adminAssistants"; 
import GenericFormModal from "../../components/forms/FormPopup";
import toast from "react-hot-toast";

const assistantsPerPage = 5;

function Assistants() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAssistantId, setSelectedAssistantId] = useState(null);
  const [showAssistantModal, setShowAssistantModal] = useState(false);
  const [editAssistant, setEditAssistant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const {
    data: assistants,
    isLoading: isLoadingAssistants,
    isError: isAssistantsError,
  } = useGetAssistants();

  const { mutate: createAssistant } = useCreateAssistant();
  const { mutate: updateAssistant } = useUpdateAssistant();
  const { mutate: deleteAssistant } = useDeleteAssistant();
  
  const filteredAssistants =
  assistants?.filter(
    (assistant) =>
      assistant?.title.toLowerCase().includes(search.toLowerCase()) ||
      (assistant?.user_name && assistant.user_name.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  const paginatedAssistants = filteredAssistants.slice(
    (page - 1) * assistantsPerPage,
    page * assistantsPerPage
  );

  const addAssistant = () => {
    setIsEditing(false);
    setEditAssistant(null);
    setShowAssistantModal(true);
  };

  const submitForm = async (data) => {
    const assistantData = {
      prompt: data.prompt,
      first_message: data.first_message || "",
      title: data.title,
      data_needed: data.data_needed || [],
    };

    if (isEditing && editAssistant?.id) {
      updateAssistant(
        { id: editAssistant.id, data: assistantData },
        {
          onSuccess: (data) => {
            // toast.success("Assistant updated successfully");
            handleSuccessToast(data,"updated successfully")
          },

        }
      );
    } else {
      createAssistant(assistantData, {
        onSuccess: () => {
          toast.success("Assistant created successfully");
        },
      });
    }

    setShowAssistantModal(false);
    setEditAssistant(null);
    setIsEditing(false);
  };

  const handleDeleteAssistant = async (assistantId) => {
    deleteAssistant(assistantId, {
      onSuccess: (res) => {
        handleSuccessToast(res, "Assistant deleted successfully");
        setShowDeleteModal(false);
      },
    });
  };

  // const handleEditClick = (assistant) => {
  //   setEditAssistant(assistant);
  //   setIsEditing(true);
  //   setShowAssistantModal(true);
  // };

  const getFormFields = () => {
    return [
      [
        {
          label: "Title",
          name: "title",
          type: "input",
          placeholder: "Enter assistant title",
          required: true,
        },
      ],
      [
        {
          label: "Prompt",
          name: "prompt",
          type: "textarea",
          placeholder: "Enter prompt for the assistant",
          required: true,
        },
      ],
      [
        {
          label: "First Message",
          name: "first_message",
          type: "textarea",
          placeholder: "Enter first message (optional)",
          required: false,
        },
      ],
      [
        {
          label: "Data Needed",
          name: "data_needed",
          type: "multiselect",
          options: [
            { value: "name", label: "Name" },
            { value: "email", label: "Email" },
            { value: "phone", label: "Phone" },
            { value: "company", label: "Company" },
          ],
          required: false,
          isMulti: true,
        },
      ],
    ];
  };

  console.log(assistants);
  return (
    <div className="space-y-8 p-10">
      <TableHeader
        Headeing="Assistant Table"
        ButtonText="Create Assistant"
        showButton={false}
        onButtonClick={addAssistant}
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search by title or first message..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-64 shadow-inner focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoadingAssistants ? (
          <div className="flex items-center justify-center h-[300px] text-gray-500 italic">
            <Loader />
          </div>
        ) : isAssistantsError ? (
          <div className="flex items-center justify-center h-[300px] text-red-500 italic">
            Error loading assistants. Please try again.
          </div>
        ) : (
          <table className="table-auto min-w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-primary/10 text-primary uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Assistant Name</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">First Message</th>
         
              </tr>
            </thead>
            <tbody>
              {paginatedAssistants.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No assistants found
                  </td>
                </tr>
              ) : (
                paginatedAssistants.map((assistant, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3">
                      {(page - 1) * assistantsPerPage + index + 1}
                    </td>
                    <td className="px-5 py-3 font-medium">{assistant.user_name}</td>
                    <td className="px-5 py-3">{assistant.title}</td>
                    <td className="px-5 py-3">
                      {assistant.first_message ? assistant.first_message.substring(0, 30) + "..." : "No first message"}
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {!isLoadingAssistants && !isAssistantsError && paginatedAssistants.length !== 0 && (
        <Pagination
          currentPage={page}
          totalItems={filteredAssistants.length}
          itemsPerPage={assistantsPerPage}
          onPageChange={setPage}
        />
      )}

      {showAssistantModal && (
        <GenericFormModal
          isOpen={showAssistantModal}
          onClose={() => {
            setShowAssistantModal(false);
            setIsEditing(false);
            setEditAssistant(null);
          }}
          title={isEditing ? "Edit Assistant" : "Create Assistant"}
          onSubmit={submitForm}
          initialValues={isEditing ? editAssistant : {}}
          fields={getFormFields()}
          width="lg"
        />
      )}

      <PopupModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Assistant"
        content="Are you sure you want to delete this assistant? This action cannot be undone."
        onPrimaryButtonClick={() => {
          handleDeleteAssistant(selectedAssistantId);
          setShowDeleteModal(false);
          setSelectedAssistantId(null);
        }}
        onSecondaryButtonClick={() => {
          setShowDeleteModal(false);
          setSelectedAssistantId(null);
        }}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        primaryButtonVariant="danger"
      />
    </div>
  );
}

export default Assistants;