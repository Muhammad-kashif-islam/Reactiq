import React, { useState, useEffect } from "react";
import { TbTrash, TbLink } from "react-icons/tb";
import { FiUploadCloud } from "react-icons/fi";
import Select from 'react-select';
import Pagination from "../../components/Pagination.jsx";
import TableHeader from "../../components/TableHeader.jsx";
import { handleSuccessToast } from "../../helpers/AsyncHandler.jsx";
import { Loader } from "../../components/Loader.jsx";
import { 
  useUploadDocument, 
  useDeleteDocument, 
  useGetDocuments, 
  useGetAttachedAssistants,
  useAttachAssistants
} from "../../hooks/knowledgebase.js";
import { useGetAssistants } from "../../hooks/assistant.js";
import ConfirmationModal from "../../components/forms/ConfirmationModal.jsx";

const documentsPerPage = 5;

const Knowledgebase = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Separate states for delete and attachment
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [documentToAttach, setDocumentToAttach] = useState(null);
  
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [selectedAssistants, setSelectedAssistants] = useState([]);
  const [isAttaching, setIsAttaching] = useState(false);

  const { data: response = { files: [] }, isLoading, isFetching, refetch } = useGetDocuments();
  const { data: assistants = [], isLoading: isLoadingAssistants } = useGetAssistants();
  const { 
    data: attachedAssistants = [], 
    isLoading: isAttachedAssistantLoading,
    refetch: refetchAttachedAssistants
  } = useGetAttachedAssistants(documentToAttach?.id);
  
  const { mutateAsync: uploadDocument, isPending: isUploading } = useUploadDocument();
  const { mutateAsync: deleteDocument } = useDeleteDocument();
  const { mutateAsync: attachAssistantsToDoc } = useAttachAssistants();

  const documents = response.files || [];

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedDocuments = filteredDocuments.slice(
    (page - 1) * documentsPerPage,
    page * documentsPerPage
  );


  const assistantOptions = assistants.map(assistant => ({
    value: assistant.id,
    label: assistant.name || `Assistant ${assistant.id}`,
  }));
  const getSelectedOptions = () => {
    return assistantOptions.filter(option => 
      selectedAssistants.includes(option.value)
    );
  };
  console.log("assistantOptions",assistantOptions);
  console.log("selectedAssistants",selectedAssistants);

  
  console.log(getSelectedOptions())
  useEffect(() => {
    if (showAttachModal && documentToAttach) {
      const initialSelected = attachedAssistants.map(assistant => assistant.id);
      setSelectedAssistants(initialSelected);
    }
  }, [showAttachModal, documentToAttach, attachedAssistants]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await uploadDocument(formData, {
        onSuccess: () => {
          handleSuccessToast(null, "Document uploaded successfully");
          setShowUploadModal(false);
          setFile(null);
          setFileName("");
          refetch();
        }
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      await deleteDocument(documentToDelete.id, {
        onSuccess: () => {
          handleSuccessToast(null, "Document deleted successfully");
          setShowDeleteModal(false);
          refetch();
        },
      });
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  const handleAttachAssistants = async () => {
    if (!documentToAttach) return;
    
    setIsAttaching(true);
    try {
      await attachAssistantsToDoc({
        documentId: documentToAttach.id,
        assistantIds: selectedAssistants
      }, {
        onSuccess: () => {
          handleSuccessToast(null, "Assistants attached successfully");
          setShowAttachModal(false);
          refetchAttachedAssistants();
        }
      });
    } catch (error) {
      console.error("Attachment failed:", error);
    } finally {
      setIsAttaching(false);
    }
  };


  const handleMultiselectChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedAssistants(selectedValues);
  };
  if (isLoading || isFetching || isLoadingAssistants) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-10">
      <TableHeader
        Headeing="Knowledgebase Documents"
        ButtonText="Upload Document"
        showButton={true}
        onButtonClick={() => setShowUploadModal(true)}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this document? This action cannot be undone"
      />

      {/* Upload Document Modal */}
      {showUploadModal && (
       <div className="fixed inset-0 bg-black/60 backdrop-blur-md h-screen flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-medium text-gray-900">Upload Document</h3>
                   <button
                     onClick={() => {
                       setShowUploadModal(false);
                       setFile(null);
                       setFileName("");
                     }}
                     className="text-gray-400 hover:text-gray-500"
                   >
                     <span className="sr-only">Close</span>
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                 </div>
                 
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Select Document
                   </label>
                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                     <div className="space-y-1 text-center">
                       <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                       <div className="flex text-sm text-gray-600">
                         <label
                           htmlFor="file-upload"
                           className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary focus-within:outline-none"
                         >
                           <span>Upload a file</span>
                           <input
                             id="file-upload"
                             name="file-upload"
                             type="file"
                             className="sr-only"
                             onChange={handleFileChange}
                             accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                           />
                         </label>
                       </div>
                       <p className="text-xs text-gray-500">
                         PDF, DOC, DOCX, TXT, XLS, XLSX, up to 10MB
                       </p>
                     </div>
                   </div>
                   {fileName && (
                     <p className="mt-2 text-sm text-gray-600">
                       Selected file: <span className="font-medium">{fileName}</span>
                     </p>
                   )}
                 </div>
                 
                 <div className="flex justify-end space-x-3">
                   <button
                     type="button"
                     onClick={() => {
                       setShowUploadModal(false);
                       setFile(null);
                       setFileName("");
                     }}
                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                   >
                     Cancel
                   </button>
                   <button
                     type="button"
                     onClick={handleUpload}
                     disabled={!file || isUploading}
                     className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${(!file || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                   >
                     {isUploading ? (
                       <span className="flex items-center">
                         <Loader className="h-4 w-4 mr-2 text-white animate-spin" />
                         Uploading...
                       </span>
                     ) : 'Upload'}
                   </button>
                 </div>
               </div>
             </div>
      )}

      {/* Attach Assistants Modal */}
      {showAttachModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md h-screen flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Attach Assistants to {documentToAttach?.name}
              </h3>
              <button
                onClick={() => {
                  setShowAttachModal(false);
                  setDocumentToAttach(null);
                  setSelectedAssistants([]);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Assistants
              </label>
              <Select
                isMulti
                options={assistantOptions}
                value={getSelectedOptions()}
                onChange={handleMultiselectChange}
                isLoading={isAttachedAssistantLoading || isLoadingAssistants}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select assistants..."
              />
              <p className="mt-2 text-sm text-gray-500">
                {selectedAssistants.length} assistant(s) selected
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAttachModal(false);
                  setDocumentToAttach(null);
                  setSelectedAssistants([]);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAttachAssistants}
                disabled={isAttaching}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  isAttaching ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAttaching ? (
                  <span className="flex items-center">
                    <Loader className="h-4 w-4 mr-2 text-white animate-spin" />
                    Attaching...
                  </span>
                ) : 'Attach Assistants'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attach Assistants
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FiUploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        {search ? 'No matching documents found' : 'No documents uploaded yet'}
                      </p>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Upload Your First Document
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedDocuments.map((document, index) => (
                  <tr key={document.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {document.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(document.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.name.split('.').pop().toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => {
                          setDocumentToAttach(document);
                          setShowAttachModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <TbLink className="mr-1" />
                         Attache Assistant
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      <div className="flex justify-end space-x-3">
                      
                        <button
                          onClick={() => {
                            setDocumentToDelete(document);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors p-1"
                          title="Delete"
                        >
                          <TbTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={page}
              totalItems={filteredDocuments.length}
              itemsPerPage={documentsPerPage}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Knowledgebase;