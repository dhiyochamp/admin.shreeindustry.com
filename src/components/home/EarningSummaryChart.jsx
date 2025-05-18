"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const EarningSummaryChart = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Earnings",
        data: data.values,
        backgroundColor: data.values.map((value, index) =>
          index === data.highlightIndex ? "#0A0338" : "#EE3131"
        ),
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `${context.raw}k`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: (value) => `${value / 1000}M`,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      className={`p-4 bg-white border h-[60vh] rounded-lg w-[46%] transition-transform duration-1000 ${
        isVisible ? "scale-100" : "scale-0"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <h3 className=" font-noraml text-base text-[#1C2A53]">
            Earning Summary
          </h3>
        </div>
        <button className="text-sm font-semibold hover:underline text-[#555F7E]">
          View Details →
        </button>
      </div>
      <div className="h-full py-8">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default EarningSummaryChart;
