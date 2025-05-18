"use client";

import React, { useEffect, useState } from "react";
import { IoBagCheckSharp } from "react-icons/io5";
import { MdAccountBalanceWallet } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
import { IoIosArrowRoundUp, IoMdSend } from "react-icons/io";
import { AiOutlineUser } from "react-icons/ai";

const statsData = [
  {
    name: "Total revenue",
    value: "$22,880.50",
    description: "Won from 18 Deals",
    percentage: "12",
    icon: AiOutlineUser,
    iconColor: "#775DA6",
  },
  {
    name: "Total revenue",
    value: "$22,880.50",
    description: "Daily average income",
    percentage: "12",
    icon: AiOutlineUser,
    iconColor: "#F9837C",
  },
  {
    name: "Total revenue",
    value: "28.50%",
    description: "Lead conversation",
    percentage: "45",
    icon: AiOutlineUser,
    iconColor: "#70B6C1",
  },
];

export default function StatsCardFinance() {
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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                <p className="text-sm font-normal text-[#454545]">
                  {stat.name}
                </p>
                <h1 className="text-xl font-bold">{stat.value}</h1>
                {/* <p className="text-sm font-normal text-[#454545]">
                  {stat.description}
                </p> */}
              </div>
              <div
                style={{
                  backgroundColor: stat.iconColor,
                }}
                className="p-3 rounded-full"
              >
                <stat.icon size={30} className="text-white" />
              </div>
            </div>
            <div className="flex items-center font-inter text-sm text-[#060606] bg-[#EE201C0D] w-fit px-2 py-1 rounded-sm">
              <IoIosArrowRoundUp size={20} />
              <p className="text-sm">{displayedPercentage[index]}%</p>
              <span className="text-xs text-nowrap">
                increase from last month
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
