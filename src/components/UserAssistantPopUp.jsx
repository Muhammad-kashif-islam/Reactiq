import React from "react";
import PopupModal from "./PopupModel";

const UserAssistantPopUp = ({ assistants, onClose, isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title="User Assistants"
      showCloseButton={true}
      width="lg" // Adjust width as needed
      content={
        <div className="max-h-[40vh] overflow-y-auto">
          {assistants && assistants.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    First Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assistants.map((assistant) => (
                  <tr key={assistant.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {assistant.user_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                      {assistant.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {assistant.first_message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No assistants found for this user
            </div>
          )}
        </div>
      }
      primaryButtonText={null} // Remove primary button
      secondaryButtonText="Close"
      onSecondaryButtonClick={onClose}
    />
  );
};

export default UserAssistantPopUp;
