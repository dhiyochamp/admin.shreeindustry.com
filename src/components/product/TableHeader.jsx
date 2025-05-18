import React from "react";

export default function TableHeader() {
  return (
    <div className="flex justify-between p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold">Products</h2>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Export
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          + Add Product
        </button>
      </div>
    </div>
  );
}
