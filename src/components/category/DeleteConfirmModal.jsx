import React from "react";
import { useDispatch } from "react-redux";

export default function DeleteConfirmModal({
  deleteConfirm,
  setDeleteConfirm,
  handleDeleteCategory,
  isLoading,
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setDeleteConfirm(null)}
    >
      <div
        className="bg-white p-6 rounded-lg w-96 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-lg font-bold mb-4">
          Are you sure you want to delete?
        </p>
        <div className="flex justify-between">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteCategory}
            disabled={isLoading}
            className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ${
              isLoading ? " opacity-20" : ""
            }`}
          >
            {isLoading ? "loading..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
