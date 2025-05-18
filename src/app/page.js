"use client";

import StatsCard from "@/components/common/StatsCard";
import EarningSummaryChart from "@/components/home/EarningSummaryChart";
import RadialChart from "@/components/home/RadialChart";
import Reminder from "@/components/home/Reminder";
import FullScreenLoader from "@/container/common/FullScreenLoader";
import Table from "@/container/common/Table";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [chartData, setChartData] = useState({
    labels: ["16", "18", "20", "22", "24", "26", "28", "30"],
    values: [1200, 1500, 1300, 2500, 800, 1000, 1800, 900],
    highlightIndex: 3,
  });
  const completed = 26;
  const delayed = 35;
  const total = 90;

  return (
    <>
      {!user?.email ? (
        <FullScreenLoader />
      ) : (
        <div className="flex flex-col gap-5 pt-[13vh]  h-full px-[1%]  overflow-y-auto custom-scrollbar">
          <div>
            <StatsCard />
          </div>
          <div className="flex items-center w-full gap-5">
            <RadialChart
              completed={completed}
              delayed={delayed}
              total={total}
            />
            <EarningSummaryChart data={chartData} />
            <Reminder />
          </div>
          <div className="w-full">
            <Table />
          </div>
        </div>
      )}
    </>
  );
}
