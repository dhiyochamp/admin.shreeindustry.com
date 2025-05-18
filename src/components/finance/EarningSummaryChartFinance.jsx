"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EarningSummaryChartFinance = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);
  const chartData = {
    labels: data.labels, // Dynamic labels (e.g., months)
    datasets: [
      {
        label: "Income",
        data: data.income, // Income data
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.4,
      },
      {
        label: "Expense",
        data: data.expense, // Expense data
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${
              tooltipItem.dataset.label
            }: $${tooltipItem.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        // beginAtZero: true,
        max: 30000, // Set maximum value
        ticks: {
          stepSize: 5000,
          callback: (value) => `$${(value / 1000).toLocaleString()}K`,
        },
      },
    },
  };

  return (
    <div
      className={`bg-white border rounded p-6 font-inter transition-transform duration-1000 ${
        isVisible ? "scale-100" : "scale-0"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <h2 className="text-base font-medium text-textColor">
            Earning Summary
          </h2>
        </div>
        <Link
          href="#"
          className="text-[#555F7E]  flex items-center font-semibold"
        >
          View Details <span className="ml-2 font-semibold">→</span>
        </Link>
      </div>
      <div className="h-[40vh] w-full">
        <Line data={chartData} options={options} className="w-full h-full " />
      </div>
    </div>
  );
};

export default EarningSummaryChartFinance;
