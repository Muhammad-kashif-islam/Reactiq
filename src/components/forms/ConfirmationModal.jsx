import React from 'react';

const ConfirmationModal = ( prop ) => {

 
  if (!prop.show) return null;

  return (
    <div className="fixed inset-0 flex items-center h-screen justify-center bg-gray-800/50 z-50 px-8 ">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
        <p className="mb-4">{prop.message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-sm sm:text-base text-gray-800 py-2 px-4 rounded hover:bg-gray-400 cursor-pointer"
            onClick={prop.onClose}
          >
            Cancel
          </button>
          <button
            className="bg-primary text-sm sm:text-base text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded hover:bg-hoverdPrimary cursor-pointer"
            onClick={prop.onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
