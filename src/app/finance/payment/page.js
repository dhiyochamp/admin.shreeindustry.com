import Invoice from "@/container/payment/Invoice";
import React from "react";

const billingData = {
  companyName: "Company Name",
  companyAddress: "Company address\nCity, Country - 00000",
  contact: "+0 (000) 123-4567",
  invoiceNumber: "#AB2324-01",
  invoiceDate: "01 Aug, 2023",
  dueDate: "15 Aug, 2023",
  reference: "INV-057",
  subject: "Design System",
  items: [
    {
      name: "Item Name",
      description: "Item description",
      quantity: 1,
      rate: 3000,
    },
    {
      name: "Item Name",
      description: "Item description",
      quantity: 1,
      rate: 1500,
    },
  ],
  taxRate: 10,
};
export default function page() {
  return (
    <div className=" pt-[13vh] h-full px-[1%] overflow-y-auto custom-scrollbar pb-16">
      <div className="w-full">
        <Invoice billingData={billingData} />
      </div>
    </div>
  );
}
