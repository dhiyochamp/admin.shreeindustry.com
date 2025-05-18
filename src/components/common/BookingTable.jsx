import React from "react";

const bookingData = [
  {
    bookingId: "BK-WZI001",
    bookingDate: "Aug 1, 2028",
    clientName: "Alice Johnson",
    carModel: "Toyota Corolla",
    carNumber: "TX1234",
    plan: "2 Days",
    startDate: "Aug 1, 2028",
    endDate: "Aug 1, 2028",
    payment: "$50",
    paymentStatus: "Paid",
    status: "Completed",
  },
  {
    bookingId: "BK-WZI001",
    bookingDate: "Aug 1, 2028",
    clientName: "Alice Johnson",
    carModel: "Toyota Corolla",
    carNumber: "TX1234",
    plan: "2 Days",
    startDate: "Aug 1, 2028",
    endDate: "Aug 1, 2028",
    payment: "$50",
    paymentStatus: "Paid",
    status: "Completed",
  },
  {
    bookingId: "BK-WZI001",
    bookingDate: "Aug 1, 2028",
    clientName: "Alice Johnson",
    carModel: "Toyota Corolla",
    carNumber: "TX1234",
    plan: "2 Days",
    startDate: "Aug 1, 2028",
    endDate: "Aug 1, 2028",
    payment: "$50",
    paymentStatus: "Pending",
    status: "Delayed",
  },
  {
    bookingId: "BK-WZI001",
    bookingDate: "Aug 1, 2028",
    clientName: "Alice Johnson",
    carModel: "Toyota Corolla",
    carNumber: "TX1234",
    plan: "2 Days",
    startDate: "Aug 1, 2028",
    endDate: "Aug 1, 2028",
    payment: "$50",
    paymentStatus: "Paid",
    status: "At risk",
  },
  {
    bookingId: "BK-WZI001",
    bookingDate: "Aug 1, 2028",
    clientName: "Alice Johnson",
    carModel: "Toyota Corolla",
    carNumber: "TX1234",
    plan: "2 Days",
    startDate: "Aug 1, 2028",
    endDate: "Aug 1, 2028",
    payment: "$50",
    paymentStatus: "Paid",
    status: "Completed",
  },
];

const tableHeadings = [
  "Booking ID",
  "Booking Date",
  "Client Name",
  "Car Model",
  "Plan",
  "Date",
  "Payment",
  "Status",
];
const BookingTable = () => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Delayed":
        return "bg-yellow-100 text-yellow-800";
      case "At risk":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto font-inter max-w-full custom-scrollbar">
      <table className="min-w-full border-collapse text-left text-sm text-gray-500">
        <thead className="bg-[#ECF5FA] text-textColor text-nowrap">
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
          {bookingData.map((booking, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 text-textColor text-sm border-b text-nowrap"
            >
              <td className="px-6 py-4 font-medium text-black text-sm">
                {booking.bookingId}
              </td>
              <td className="px-6 py-4">{booking.bookingDate}</td>
              <td className="px-6 py-4">{booking.clientName}</td>
              <td className="px-6 py-4 text-sm">
                <p className="pb-1"> {booking.carModel} </p>
                <span className="bg-[#ECF5FA] rounded-sm text-xs px-1 py-1">
                  {booking.carNumber}
                </span>
              </td>
              <td className="px-6 py-4">{booking.plan}</td>
              <td className=" py-2 px-6 text-sm">
                <p className="py-1">Start: {booking.startDate}</p>
                <p className="pb-1">End: {booking.endDate}</p>
              </td>
              <td className="px-6 py-4">
                <p className="font-medium pb-1">{booking.payment}</p>
                <span
                  className={`text-xs px-3 py-1 rounded-sm ${
                    booking.paymentStatus === "Paid"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-red-50 text-primary"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
