import React from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useGetAssistantsByUser } from "../../hooks/adminAssistants";
import { FaExclamationTriangle, FaUser, FaRobot, FaCommentAlt } from 'react-icons/fa';
import { Loader } from '../../components/Loader';
import { IoArrowBackCircleSharp } from "react-icons/io5";
const UserAssistant = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  if (!userId) {
    navigate("/not-found");
  }

  const {
    data: userAssistants,
    isLoading: isLoadingUserAssistants,
    isError: isErrorUserAssistants,
  } = useGetAssistantsByUser(userId);

  return (
    <div className=" overflow-hidden p-10">
      <div className="p-5 pl-0 py-5 sm:py-8 flex gap-3 items-center">
         <IoArrowBackCircleSharp onClick={()=> navigate("/admin/user")} className='text-primary text-2xl' />

        <h2 className="text-2xl font-semibold text-primary flex items-center">
          User Assistants
        </h2>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm" >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className=" bg-primary/10">
            <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-primary  tracking-wider">
                <div className="flex items-center">
                  #
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-primary  tracking-wider">
                <div className="flex items-center">
                  Name
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-primary  tracking-wider">
                <div className="flex items-center">
                  Title
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-primary  tracking-wider">
                <div className="flex items-center">
                  First Message
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoadingUserAssistants && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  <div className="flex justify-center items-center">
                    <Loader color='border-primary'/>
                  </div>
                </td>
              </tr>
            )}
            
            {isErrorUserAssistants && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-red-500 bg-red-50 m-h-5">
                  <div className="flex justify-center items-center">
                    <FaExclamationTriangle className="mr-3" />
                    <span>Error fetching assistants. Please try again.</span>
                  </div>
                </td>
              </tr>
            )}
            
            {userAssistants && userAssistants.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 min-h-5">
                  <div className="flex justify-center items-center">
                    <FaExclamationTriangle className="mr-3" />
                    <span>No assistants found for this user.</span>
                  </div>
                </td>
              </tr>
            )}
            
            {userAssistants && userAssistants.length > 0 && userAssistants.map((assistant, index) => (
              <tr key={assistant.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index+1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {assistant.user_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                  {assistant.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="max-w-md truncate hover:text-clip hover:whitespace-normal">
                    {assistant.first_message || 'No message'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {userAssistants && userAssistants.length > 0 && (
        <div className="px-5 py-3  pl-0 border-t border-gray-200 text-sm text-gray-500">
          Showing {userAssistants.length} assistant{userAssistants.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default UserAssistant;