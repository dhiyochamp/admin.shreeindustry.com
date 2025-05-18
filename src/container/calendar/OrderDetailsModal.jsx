"use client";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";

const OrderDetailsModal = ({ isOpen, onClose }) => {
  // Close modal on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === "modalBackground") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Dummy Data
  const userDetails = {
    customerId: "OS1343",
    name: "John Doe",
    location: "New York, USA",
  };

  const orderDetails = {
    orderId: "ORD56789",
    orderStatus: "Processing",
    paymentStatus: "Paid",
    productName: "Wireless Headphones",
    quantity: 2,
    productPrice: "$199.99",
    orderDate: "2025-02-25",
  };

  const paymentDetails = {
    paymentId: "PAY123456",
    paymentStatus: "Completed",
    paymentDate: "2025-02-26",
    upiId: "john.doe@upi",
  };

  return (
    <div
      id="modalBackground"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white w-96 md:w-[500px] rounded-lg shadow-lg px-6 py-10 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600"
          onClick={onClose}
        >
          <RxCross2 size={20} />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-black text-center mb-4">
          Order Details
        </h2>

        {/* User Details */}
        <div className="mb-4 border-b pb-3">
          <h3 className="text-lg font-semibold text-black mb-2">
            User Details
          </h3>
          <div className="grid grid-cols-2 ">
            <p className="text-sm text-gray-600">
              <strong>Customer ID:</strong> {userDetails.customerId}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {userDetails.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Location:</strong> {userDetails.location}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-4 border-b pb-3">
          <h3 className="text-lg font-semibold text-black mb-2">
            Order Details
          </h3>
          <div className="grid grid-cols-2">
            <p className="text-sm text-gray-600">
              <strong>Order ID:</strong> {orderDetails.orderId}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Order Status:</strong> {orderDetails.orderStatus}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Payment Status:</strong> {orderDetails.paymentStatus}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Product:</strong> {orderDetails.productName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Quantity:</strong> {orderDetails.quantity}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Price:</strong> {orderDetails.productPrice}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Order Date:</strong> {orderDetails.orderDate}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-2 ">
            Payment Details
          </h3>
          <div className="grid grid-cols-2">
            <p className="text-sm text-gray-600">
              <strong>Payment ID:</strong> {paymentDetails.paymentId}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Payment Status:</strong> {paymentDetails.paymentStatus}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Payment Date:</strong> {paymentDetails.paymentDate}
            </p>
            <p className="text-sm text-gray-600">
              <strong>UPI ID:</strong> {paymentDetails.upiId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
