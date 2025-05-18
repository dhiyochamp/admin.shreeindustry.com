import React from "react";
import { GrNext, GrPrevious } from "react-icons/gr";

const PaginationComponent = ({
  currentPage,
  setCurrentPage,
  totalPages,
  itemPerPage,
  setItemPerPage,
}) => {
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCurrentPage = (pageNo) => {
    if (pageNo >= 1 && pageNo <= totalPages) {
      setCurrentPage(pageNo);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemPerPage(Number(event.target.value)); // Convert string to number
  };

  return (
    <div className="w-full mx-auto py-2 px-5 flex items-center justify-between gap-[14px]">
      <div className="flex gap-5 items-center">
        <p className="text-sm font-medium text-gray-600">Show</p>
        <select
          className="px-3 py-1 text-sm border border-gray-700 rounded-md focus:outline-none focus:border-primary"
          value={itemPerPage} // Bind state to select value
          onChange={handleItemsPerPageChange} // Update state on change
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
        <p className="text-sm font-medium text-gray-600">Rows</p>
      </div>

      <div className="w-fit flex items-center gap-[14px]">
        <button
          className="w-7 h-7 flex items-center justify-center bg-[#F2F2F2] disabled:cursor-not-allowed rounded-md"
          disabled={currentPage === 1}
          onClick={handlePrev}
        >
          <GrPrevious
            size={14}
            className={`${currentPage !== 1 ? "text-black" : "text-gray-500"}`}
          />
        </button>

        <div className="md:flex items-center justify-between hidden ">
          {currentPage > 3 && (
            <>
              <button
                className={`font-medium ${
                  currentPage === 1
                    ? "w-7 h-7 flex items-center justify-center bg-primary text-white rounded-md"
                    : "text-black"
                }`}
                onClick={() => handleCurrentPage(1)}
              >
                1
              </button>
              <span className="mx-[14px]">...</span>
            </>
          )}

          {Array.from({ length: 5 }, (_, index) => {
            let page;

            if (currentPage <= 3) {
              page = index + 1;
            } else if (currentPage > totalPages - 3) {
              page = totalPages - 4 + index;
            } else {
              page = currentPage - 2 + index;
            }

            if (page > 0 && page <= totalPages) {
              return (
                <button
                  key={page}
                  className={`font-medium ${
                    currentPage === page
                      ? "w-7 text-sm h-7 flex items-center justify-center bg-primary text-white rounded-md"
                      : "text-black w-7 h-7 flex items-center justify-center"
                  }`}
                  onClick={() => handleCurrentPage(page)}
                >
                  {page}
                </button>
              );
            }
            return null;
          })}

          {currentPage < totalPages - 2 && (
            <>
              <span className="mx-[14px]">...</span>
              <button
                className={`font-medium  ${
                  currentPage === totalPages
                    ? "w-7 h-7 text-sm flex items-center justify-center bg-primary text-white rounded-md"
                    : "text-black"
                }`}
                onClick={() => handleCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 md:hidden">
          {currentPage > 3 && (
            <>
              <button
                className={`font-medium  ${
                  currentPage === 1
                    ? "w-7 h-7 text-sm flex items-center justify-center bg-primary text-white rounded-md"
                    : "text-black"
                }`}
                onClick={() => handleCurrentPage(1)}
              >
                1
              </button>
              <span>...</span>
            </>
          )}

          {Array.from({ length: 3 }, (_, index) => {
            let page;
            if (currentPage <= 2) {
              page = index + 1;
            } else if (currentPage > totalPages - 2) {
              page = totalPages - 2 + index;
            } else {
              page = currentPage - 1 + index;
            }

            if (page > 0 && page <= totalPages) {
              return (
                <button
                  key={page}
                  className={`font-medium ${
                    currentPage === page
                      ? "w-7 h-7 text-sm flex items-center justify-center bg-primary text-white rounded-md"
                      : "text-black"
                  }`}
                  onClick={() => handleCurrentPage(page)}
                >
                  {page}
                </button>
              );
            }
            return null;
          })}

          {currentPage < totalPages - 2 && (
            <>
              <span>...</span>
              <button
                className={` font-medium  ${
                  currentPage === totalPages
                    ? "w-7 h-7  text-sm flex items-center justify-center bg-primary text-white rounded-md"
                    : "text-black"
                }`}
                onClick={() => handleCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="w-7 h-7 flex items-center justify-center bg-[#F2F2F2] disabled:cursor-not-allowed rounded-md "
          disabled={currentPage === totalPages}
          onClick={handleNext}
        >
          <GrNext
            size={14}
            className={`${
              currentPage !== totalPages ? "text-black" : "text-gray-500"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;
