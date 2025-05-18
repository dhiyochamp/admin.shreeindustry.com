"use client";

import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const RadialChart = ({ completed, delayed, total }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const percentage = Math.round((completed / total) * 100);

  // Data for the chart
  const [chartData, setChartData] = useState({
    labels: ["Completed", "Delayed", "Pending"],
    datasets: [
      {
        data: [completed, delayed, total - completed - delayed],
        backgroundColor: ["#4CAF50", "#FFC107", "#FF5252"],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  });

  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: [completed, delayed, total - completed - delayed],
        },
      ],
    }));
  }, [completed, delayed, total]);

  // Chart options
  const options = {
    rotation: -90,
    circumference: 180,
    cutout: "85%",
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div
      className={`relative bg-white rounded-lg p-4  border h-[60vh] w-[27%] font-inter transition-transform duration-1000 ${
        isVisible ? "scale-100" : "scale-0"
      }`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-base font-semibold">Rent Status</h2>
        <select className="border rounded-md p-1 text-sm text-gray-600 bg-[#EFF1F3] focus:outline-none">
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Yearly</option>
        </select>
      </div>

      {/* Chart Section */}
      <div className="relative  ">
        <Doughnut data={chartData} options={options} />

        {/* Percentage Display */}
        <div className="absolute  inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-center">{percentage}%</p>
          <p className="text-sm text-textColor">Completed</p>
        </div>

        {/* Data Display in the same box */}
        <div className="absolute bottom-0 w-full flex justify-between items-center text-sm text-gray-600">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600 text-center">
              {completed}
            </p>
            <p className="text-sm text-textColor font-normal">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-yellow-600">{delayed}</p>
            <p className="text-sm text-textColor font-normal">Delayed</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-600">
              {total - completed - delayed}
            </p>
            <p className="text-sm text-textColor font-normal">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadialChart;
