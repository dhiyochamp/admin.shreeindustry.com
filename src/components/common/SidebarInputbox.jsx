import React, { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

export default function SidebarInputbox({
  label,
  value,
  onChange,
  type = "text",
  isEditable = true,
  checkType,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleEditClick = () => {
    if (isEditable && !checkType) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (inputValue !== value) {
      onChange(inputValue);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const paymentOptions = ["Pending", "Paid"];
  const statusOptions = ["Complete", "Delayed", "At risk"];

  return (
    <div className="grid grid-cols-3 items-center gap-4 relative">
      <label className="text-sm font-normal text-textColor text-nowrap">
        {label}
      </label>
      <div className="relative col-span-2">
        {checkType ? (
          // If checkType is true, show input without editing and no edit icon
          <input
            type={type}
            className="w-full border-gray-300 rounded-md border py-2 pl-2 pr-10 focus:outline-none focus:border-gray-800 text-sm"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ) : isEditing ? (
          type === "select" ? (
            // Dropdown for payment or status
            <select
              value={inputValue}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border-gray-300 rounded-md border py-2 pl-2 pr-10 focus:outline-none focus:border-gray-800 text-sm !appearance-none"
            >
              {(label === "Payment" ? paymentOptions : statusOptions).map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          ) : (
            // Default text input
            <input
              type={type}
              className="w-full border-gray-300 rounded-md border py-2 pl-2 pr-10 focus:outline-none focus:border-gray-800 text-sm"
              value={inputValue}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
            />
          )
        ) : (
          <input
            type={type}
            className="w-full border-gray-300 rounded-md border py-2 pl-2 pr-10 focus:outline-none focus:border-gray-800 text-sm"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            readOnly
          />
        )}
        {isEditable &&
          !checkType &&
          (type === "select" ? (
            <IoIosArrowDown
              onClick={handleEditClick}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            />
          ) : (
            <FiEdit3
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={handleEditClick}
            />
          ))}
      </div>
    </div>
  );
}
