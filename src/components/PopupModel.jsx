import { useEffect } from 'react';
import { AiOutlineClose, AiFillInfoCircle } from "react-icons/ai";

const PopupModal = ({
  isOpen,
  onClose,
  title,
  content = "Please confirm your action",
  primaryButtonText = 'Confirm',
  secondaryButtonText = 'Cancel',
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  primaryButtonVariant = 'primary',
  secondaryButtonVariant = 'secondary',
  showCloseButton = true,
  width = 'md',
  overlayBlur = true,
  icon: Icon = AiFillInfoCircle, 
  iconColor = 'text-primary',
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  const buttonVariants = {
    primary: 'bg-primary hover:bg-indigo-700 text-white',
    secondary: 'bg-black hover:bg-gray-800 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  };

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto">
      <div
        className={`fixed inset-0  bg-opacity-30 transition-opacity ${overlayBlur ? 'backdrop-blur-md' : ''}`}
        onClick={onClose}
      />
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div
          className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full ${widthClasses[width]} sm:my-8`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`h-6 w-6 ${iconColor}`} />
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  {title}
                </h3>
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  className="ml-4 inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <AiOutlineClose className="h-6 w-6 text-red-600 font-bold" aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 p-4">{content}</p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
            {primaryButtonText && (
              <button
                type="button"
                className={`cursor-pointer inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none sm:ml-3 sm:w-auto ${buttonVariants[primaryButtonVariant]}`}
                onClick={onPrimaryButtonClick}
              >
                {primaryButtonText}
              </button>
            )}
            {secondaryButtonText && (
              <button
                type="button"
                className={`mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none sm:mt-0 sm:w-auto ${buttonVariants[secondaryButtonVariant]} cursor-pointer`}
                onClick={onSecondaryButtonClick || onClose}
              >
                {secondaryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
