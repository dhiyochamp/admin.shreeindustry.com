import React from "react";
import { IoChevronBackSharp } from "react-icons/io5";

export default function CustomerInfo({ onClose }) {
  return (
    <div className="w-full mx-auto px-5 min-h-screen">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={onClose}
          className="flex items-center text-black cursor-pointer"
        >
          <IoChevronBackSharp />
          Back
        </button>
      </div>

      {/* Card Container */}
      <div className=" flex items-start gap-10 w-full">
        {/* Customer Profile */}
        <div className="flex flex-col gap-4 w-[65%] bg-white shadow-sm p-4 rounded h-[40vh]">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-4">
              {/* Profile Avatar */}
              <div className="w-14 h-14 flex items-center justify-center bg-gray-300 text-xl font-semibold text-white rounded-full">
                R
              </div>
              {/* Customer Details */}
              <div>
                <h2 className="text-xl font-semibold">Randhir Kumar</h2>
                <p className="text-gray-600 text-sm">India</p>
                <p className="text-gray-600 text-sm">5 Orders</p>
                <p className="text-gray-600 text-sm">Customer for 2 years</p>
              </div>
            </div>
            {/* Star Ratings */}
            <div className="flex items-center">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-5 h-5 bg-yellow-400 clip-star"></div>
              ))}
              <div className="w-5 h-5 bg-yellow-400 opacity-75 clip-star"></div>
            </div>
          </div>

          {/* Customer Notes */}
          <div className="mt-6">
            <h3 className="font-semibold">Customer Notes</h3>
            <textarea
              className="w-full mt-2 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add notes about customer"
            />
          </div>
        </div>
        {/* Overview Panel */}
        <div className="bg-white shadow-sm p-4 rounded w-[30%] min-h-[40vh] flex flex-col justify-between">
          {/* Upper Section */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Overview</h3>
              <button className="text-blue-600">Edit</button>
            </div>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Address:</span> Panapur langa,
              Hajipur, Vaishali, 844124, India
            </p>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Email Address:</span>{" "}
              randhirppl@gmail.com
            </p>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Phone:</span> +91 8804789764
            </p>
          </div>

          {/* Delete Button at Bottom */}
          <button className="text-red-500 mt-4 text-start">
            Delete Customer
          </button>
        </div>

        {/* Action Buttons */}
        {/* <div className="mt-6 flex justify-end gap-2">
          <button className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-200">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save
          </button>
        </div> */}
      </div>
    </div>
  );
}
