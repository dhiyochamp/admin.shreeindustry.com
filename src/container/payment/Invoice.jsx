"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { FiPrinter } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Invoice({ billingData }) {
  const invoiceRef = useRef();

  const {
    companyName,
    companyAddress,
    contact,
    invoiceNumber,
    invoiceDate,
    dueDate,
    reference,
    subject,
    items,
    taxRate,
  } = billingData;

  const subtotal = items.reduce(
    (sum, item) => sum + item.rate * item.quantity,
    0
  );
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("portrait", "px", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-full flex flex-col items-center px-5 font-inter">
      <div className="flex items-center justify-end w-full pb-3 px-4 gap-10">
        <div
          onClick={handlePrint}
          className="bg-white shadow-md rounded-full flex items-center px-4 py-3 gap-2"
        >
          <FiPrinter size={20} />
          <span className="font-inter text-sm font-medium">Print</span>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-2 bg-primary text-white rounded-full px-5 py-3"
        >
          <MdOutlineFileDownload size={20} />
          <span className="text-sm text-white font-medium"> Download </span>
        </button>
      </div>

      {/* Invoice */}
      <div
        ref={invoiceRef}
        className="px-6 pb-32 w-full h-fit bg-white border rounded-md font-inter"
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full py-5 px-4 border-b-2">
          <div className="relative h-20 w-40 ">
            <Image src="/assets/luxe.svg" layout="fill" objectFit="contain" />
          </div>
          <div className="text-end space-y-1 text-sm font-poppins text-[#5E6470] font-normal">
            <p>Business address </p>
            <p>City, State, IN - 000 000</p>
            <p>TAX ID 00XXXXX1234X0XX</p>
          </div>
        </div>
        <div className="flex justify-between h-fit w-full mb-6 mt-5">
          {/* first col */}
          <div className="flex flex-col gap-20  h-full">
            <div className="flex flex-col text-start">
              <h1 className="text-sm text-[#5E6470] ">Billed to</h1>
              <p className="text-sm font-semibold text-black">Company Name</p>
              <p className="text-[#5E6470] text-sm">Company address</p>
              <p className="text-[#5E6470] text-sm">City, Country - 00000</p>
              <p className="text-[#5E6470] text-sm">+0 (000) 123-4567</p>
            </div>
            <div className="">
              <h1 className="text-sm text-[#5E6470]">Subject </h1>
              <p className="text-sm font-semibold text-black">Design System</p>
            </div>
          </div>
          {/* sec col */}
          <div className="flex flex-col justify-between ">
            <div className="flex flex-col text-start">
              <h1 className="text-sm text-[#5E6470]">Invoice number</h1>
              <p className="text-sm font-semibold text-black">#AB2324-01</p>
            </div>
            <div className="flex flex-col text-start">
              <h1 className="text-sm text-[#5E6470]">Reference</h1>
              <p className="text-sm font-semibold text-black">INV-057</p>
            </div>
            <div className="flex flex-col text-start">
              <h1 className="text-sm text-[#5E6470]">Invoice date</h1>
              <p className="text-sm font-semibold text-black">01 Aug, 2023</p>
            </div>
          </div>
          {/* third col */}
          <div className="flex flex-col justify-between ">
            <div className="flex flex-col text-start">
              <h1 className="text-sm text-[#5E6470]">Invoice of (USD)</h1>
              <p className="text-lg font-bold text-[#E87117]">$4,950.00</p>
            </div>
            <div className="flex flex-col text-start">
              <h1 className="text-sm text-[#5E6470]">Due date</h1>
              <p className="text-sm font-semibold text-black">15 Aug, 2023</p>
            </div>
          </div>
        </div>

        <table className="w-full text-left border-y border-gray-300">
          <thead className="">
            <tr className="border-b  text-sm text-[#5E6470] font-semibold font-inter">
              <th className="py-2">ITEM DETAIL</th>
              <th className="py-2 text-center">QTY</th>
              <th className="py-2 text-right">RATE</th>
              <th className="py-2 text-right">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="">
                <td className="py-4">
                  <p className="text-sm text-black font-semibold">
                    {item.name}
                  </p>
                  <p className="text-sm ">{item.description}</p>
                </td>
                <td className="py-2 text-center text-sm font-medium text-[#1A1C21]">
                  {item.quantity}
                </td>
                <td className="py-2 text-right text-sm font-medium text-[#1A1C21]">
                  ${item.rate.toFixed(2)}
                </td>
                <td className="py-2 text-right text-sm font-medium text-[#1A1C21]">
                  ${(item.rate * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full flex justify-end mt-4">
          <div className="w-[55%] space-y-4">
            <div className="flex justify-between items-center w-full">
              <span className="text-[#1A1C21] text-sm">Subtotal</span>
              <span className="font-medium text-[#1A1C21]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="text-[#1A1C21] text-sm">Tax ({taxRate}%)</span>
              <span className="font-medium text-[#1A1C21]">
                ${tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="text-[#1A1C21] text-sm font-bold">Total</span>
              <span className="text-sm font-bold text-[#1A1C21]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
