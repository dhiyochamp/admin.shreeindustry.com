"use client";

import React, { useEffect, useState } from "react";
import { IoBagCheckSharp } from "react-icons/io5";
import { MdAccountBalanceWallet } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
import { IoMdSend } from "react-icons/io";

const statsData = [
  {
    value: "$22,880.50",
    description: "Won from 18 Deals",
    percentage: "67",
    icon: IoBagCheckSharp,
    iconColor: "#775DA6",
  },
  {
    value: "$22,880.50",
    description: "Daily average income",
    percentage: "80",
    icon: MdAccountBalanceWallet,
    iconColor: "#F9837C",
  },
  {
    value: "28.50%",
    description: "Lead conversation",
    percentage: "45",
    icon: TfiStatsUp,
    iconColor: "#70B6C1",
  },
  {
    value: "805",
    description: "Campaign sent",
    percentage: "67",
    icon: IoMdSend,
    iconColor: "#D4B14B",
  },
];

export default function StatsCard() {
  const [progress, setProgress] = useState(statsData.map(() => 0));
  const [displayedPercentage, setDisplayedPercentage] = useState(
    statsData.map(() => 0)
  );
  const [scale, setScale] = useState(statsData.map(() => 0));

  useEffect(() => {
    // Incrementally scale each card
    const scaleTimers = statsData.map(
      (_, index) =>
        setTimeout(() => {
          setScale((prevScale) => {
            const newScale = [...prevScale];
            newScale[index] = 100; // Scale to full size
            return newScale;
          });
        }, index * 150) // Delay between cards
    );

    // Set the progress bar width
    const progressTimers = statsData.map((stat, index) =>
      setTimeout(() => {
        setProgress((prevProgress) => {
          const newProgress = [...prevProgress];
          newProgress[index] = stat.percentage;
          return newProgress;
        });
      }, 200)
    );

    // Incrementally increase the displayed percentage
    const intervalIds = statsData.map(
      (stat, index) =>
        setInterval(() => {
          setDisplayedPercentage((prev) => {
            const updated = [...prev];
            if (updated[index] < stat.percentage) {
              updated[index] += 1; // Increment by 1
            } else {
              clearInterval(intervalIds[index]); // Clear interval when target is reached
            }
            return updated;
          });
        }, 15) // Adjust speed of increment
    );

    return () => {
      scaleTimers.forEach((timer) => clearTimeout(timer));
      progressTimers.forEach((timer) => clearTimeout(timer));
      intervalIds.forEach((id) => clearInterval(id)); // Clean up intervals
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="w-full h-full bg-white border border-gray-300 rounded-md px-5 py-5 transition-transform duration-1000 ease-in-out"
          style={{
            transform: `scale(${scale[index] / 100})`,
            opacity: scale[index] / 100,
          }}
        >
          <div className="font-inter flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold">{stat.value}</h1>
                <p className="text-sm font-normal text-[#454545]">
                  {stat.description}
                </p>
              </div>
              <stat.icon size={30} style={{ color: stat.iconColor }} />
            </div>
            <div className="flex justify-between items-center">
              <div className="w-full h-1 rounded-xl overflow-hidden bg-gray-200">
                <div
                  style={{
                    width: `${progress[index]}%`, // Set the width dynamically
                    backgroundColor: stat.iconColor,
                  }}
                  className={`h-full transition-all duration-1000 ease-in-out`} // Smooth transition
                ></div>
              </div>
              <p className="text-gray-500 text-base ml-2">
                {displayedPercentage[index]}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
