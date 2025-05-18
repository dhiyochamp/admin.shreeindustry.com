"use client";

import CalendarNavbar from "@/components/calendar/CalendarNavbar";
import EditEvent from "@/components/modals/EditEvent";
import PaymentTable from "@/container/payment/PaymentTable";
import React, { useEffect, useState } from "react";

export default function page() {
  const [editModal, setEditModal] = useState(false);
  const [selectedDate, setselectedDate] = useState(new Date());
  const [headingDate, setHeadingDate] = useState(["GMT"]);
  const handleNextDate = (isNext) => {
    const date = new Date(selectedDate);
    date.setDate(isNext ? date.getDate() + 1 : date.getDate() - 1);
    setselectedDate(date);
  };

  const getWeekDates = (date) => {
    const weekDates = [];
    const startDate = new Date(date); // Clone the selected date
    console.log(startDate, "start Date");
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(startDate); // Clone the start date
      nextDate.setDate(startDate.getDate() + i); // Increment days
      const dayName = nextDate.toLocaleString("en-IN", { weekday: "short" }); // Get weekday name
      const dayDate = nextDate.getDate(); // Get date
      weekDates.push(`${dayName} ${dayDate}`);
    }

    return weekDates;
  };

  useEffect(() => {
    const weekDays = getWeekDates(selectedDate);
    setHeadingDate(["GMT", ...weekDays]);
  }, [selectedDate]);

  const TypesofSort = [
    {
      name: "Payment Status",
      option: ["Completed", "Delayed", "At risk"],
    },
    {
      name: "Order Status",
      option: ["Paid", "Pending"],
    },
  ];
  const timeSlots = [
    {
      time: { start: "10:00 AM", end: "10:30 AM" },
      events: ["", "", "Meeting", "", "", "", ""],
    },
    {
      time: { start: "10:00 AM", end: "10:30 AM" },
      events: ["Call", "", "", "Review", "", "", ""],
    },
    {
      time: { start: "10:00 AM", end: "10:30 AM" },
      events: ["", "Workshop", "", "", "Presentation", "", ""],
    },
    {
      time: { start: "10:00 AM", end: "10:30 AM" },
      events: ["", "Workshop", "", "", "Presentation", "", ""],
    },
    {
      time: { start: "10:00 AM", end: "10:30 AM" },
      events: ["", "Workshop", "", "", "Presentation", "", ""],
    },
  ];
  return (
    <div className="pt-[13vh] h-full px-[1%] overflow-y-auto custom-scrollbar">
      <div>
        <CalendarNavbar
          heading={headingDate}
          timeSlots={timeSlots}
          handleNextDate={handleNextDate}
          setselectedDate={setselectedDate}
          selectedDate={selectedDate}
          TypesofSort={TypesofSort}
        />

        <div className="py-3 px-2">
          <PaymentTable />
        </div>
      </div>
      <EditEvent isModalOpen={editModal} onClose={() => setEditModal(false)} />
    </div>
  );
}
