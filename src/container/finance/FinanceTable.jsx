import React, { useState } from "react";
import { MdIndeterminateCheckBox } from "react-icons/md";

const initialTableData = [
  {
    expenses: "Oil Change",
    category: "Vehicle Maintenance",
    quantity: 1,
    amount: "$50",
    date: "Aug 1, 2028",
    status: "Completed",
  },
  {
    expenses: "Oil Change",
    category: "Vehicle Maintenance",
    quantity: 1,
    amount: "$50",
    date: "Aug 1, 2028",
    status: "Completed",
  },
  {
    expenses: "Oil Change",
    category: "Vehicle Maintenance",
    quantity: 1,
    amount: "$50",
    date: "Aug 1, 2028",
    status: "Completed",
  },
  {
    expenses: "Oil Change",
    category: "Vehicle Maintenance",
    quantity: 1,
    amount: "$50",
    date: "Aug 1, 2028",
    status: "Completed",
  },
  {
    expenses: "Oil Change",
    category: "Vehicle Maintenance",
    quantity: 1,
    amount: "$50",
    date: "Aug 1, 2028",
    status: "Completed",
  },
];

const tableHeadings = [
  <MdIndeterminateCheckBox size={20} />,
  "Expenses",
  "Category",
  "Quantity",
  "Amount",
  "Date",
  "Status",
  "Action",
];

const FinanceTable = () => {
  const [tableData, setTableData] = useState(initialTableData);

  const handleDelete = (index) => {
    const updatedData = tableData.filter((_, i) => i !== index);
    setTableData(updatedData);
    alert("Record deleted");
  };

  return (
    <div className="overflow-x-auto font-inter max-w-full custom-scrollbar">
      <table className="min-w-full border-collapse text-left text-sm text-gray-500">
        <thead className="bg-[#ECF5FA] text-textColor">
          <tr>
            {tableHeadings.map((heading, index) => (
              <th
                key={index}
                className="px-6 py-4 font-medium text-sm text-textColor"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 text-textColor text-sm border-b"
            >
              <td className="px-6 py-4 font-medium">
                <input type="checkbox" className="w-3 h-3 " />
              </td>
              <td className="px-6 py-4 font-medium text-nowrap">
                {data.expenses}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 bg-gray-100 py-1 px-2 rounded-sm">
                  <span className="bg-[#0A0338] w-3 h-3 rounded-sm"></span>
                  <span className="whitespace-nowrap">{data.category}</span>
                </div>
              </td>

              <td className="px-6 py-4">{data.quantity}</td>
              <td className="px-6 py-4">{data.amount}</td>
              <td className="px-6 py-4 text-nowrap">{data.date}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                  {data.status}
                </span>
              </td>
              <td className="px-6 py-4 flex items-center gap-4 font-inter">
                <button className="py-0.5 font-normal px-2 text-white bg-primary rounded-full text-sm">
                  Preview
                </button>
                <button className="py-0.5 px-3 font-normal bg-blue-100 rounded-full text-blue-700 text-sm">
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinanceTable;
