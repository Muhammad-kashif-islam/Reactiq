import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
  showPageNumbers = true,
  showItemsCount = true,
  prevNextLabels = { prev: "Prev", next: "Next" },
  variant = "default" 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    if (variant === 'minimal' || !showPageNumbers) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? "bg-primary text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          aria-current={currentPage === i ? "page" : undefined}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pages.unshift(
        <span key="start-ellipsis" className="px-2 py-1">
          ...
        </span>
      );
      pages.unshift(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100"
        >
          1
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <span key="end-ellipsis" className="px-2 py-1">
          ...
        </span>
      );
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-100"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      {showItemsCount && (
        <span className="text-sm text-gray-600">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}-
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </span>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={isFirstPage}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md border ${
            isFirstPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-primary hover:bg-gray-50 cursor-pointer"
          }`}
          aria-label="Previous page"
        >
          {variant === 'default' ? <FiChevronLeft /> : null}
          {prevNextLabels.prev}
        </button>

        {renderPageNumbers()}

        <button
          onClick={handleNext}
          disabled={isLastPage}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md border ${
            isLastPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-primary hover:bg-gray-50 cursor-pointer"
          }`}
          aria-label="Next page"
        >
          {prevNextLabels.next}
          {variant === 'default' ? <FiChevronRight /> : null}
        </button>
      </div>
    </div>
  );
};

export default Pagination;