"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartFinance = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const data = {
    labels: ["To Do", "In Progress", "Done", "Blocked", "Testing"],
    datasets: [
      {
        label: "Issues",
        data: [28, 12, 6, 20, 15],
        backgroundColor: [
          "#8e44ad",
          "#f1c40f",
          "#2ecc71",
          "#e74c3c",
          "#3498db",
        ],
        borderWidth: 1,
      },
    ],
  };

  const totalIssues = data.datasets[0].data.reduce((acc, val) => acc + val, 0);

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top",
  //       display: false,
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: function (tooltipItem) {
  //           const value = data.datasets[0].data[tooltipItem.dataIndex];
  //           const percentage = ((value / totalIssues) * 100).toFixed(1);
  //           return `${value} (${percentage}%)`;
  //         },
  //       },
  //     },
  //   },
  //   cutout: "70%",
  // };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.chart.data.datasets[0];
            const value = dataset.data[tooltipItem.dataIndex];
            const total = dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div
      className={`px-4 py-2 border rounded-lg bg-white font-inter h-full ${
        isVisible ? "scale-100" : "scale-0"
      }`}
    >
      <h2 className="text-lg font-bold mb-2 text-center">Pie Chart Example</h2>
      <div className="w-56 mx-auto relative p-4">
        <Doughnut data={data} options={options} />
        <div className="absolute top-5 inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-textColor font-medium">Total Issues</p>
          <p className="text-2xl text-black font-inter font-semibold">
            {totalIssues}
          </p>
        </div>
      </div>

      <div className="mt-0">
        <table className="table-auto w-full text-left text-sm mt-0">
          <thead className="border-b py-2">
            <tr className="text-sm font-inter font-normal text-[#737373]">
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Issues</th>
              <th className="px-2 py-1">%</th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {data.labels.map((label, index) => {
              const value = data.datasets[0].data[index];
              const percentage = ((value / totalIssues) * 100).toFixed(1);
              return (
                <tr key={index} className="">
                  <td className="px-2 py-1 text-nowrap">
                    <span
                      className="inline-block w-4 h-4 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          data.datasets[0].backgroundColor[index],
                      }}
                    ></span>
                    {label}
                  </td>
                  <td className="px-2 py-2 font-medium">{value}</td>
                  <td className="px-2 py-2 font-medium">{percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PieChartFinance;
