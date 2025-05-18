"use client";

import EarningSummaryChartFinance from "@/components/finance/EarningSummaryChartFinance";
import PieChartFinance from "@/components/finance/PieChartFinance";
import StatsCardFinance from "@/components/finance/StatsCardFinance";
import FullTable from "@/container/finance/FullTable";
import React from "react";

export default function Page() {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    income: [18450, 22300, 17500, 20000, 24000, 26000, 22000],
    expense: [18450, 19300, 16000, 19000, 20000, 23000, 18000],
  };
  return (
    <div className="flex flex-col gap-5 pt-[13vh] h-full px-[1%] overflow-y-auto custom-scrollbar">
      {/* Section for Stats and Chart */}
      <div className="w-full flex items-center gap-2 h-full">
        <div className="w-[75%] flex flex-col gap-5">
          <StatsCardFinance />
          <EarningSummaryChartFinance data={chartData} />
        </div>
        <div className="w-[25%] h-full">
          <PieChartFinance />
        </div>
      </div>
      <div className="w-full h-full">
        <FullTable />
      </div>
    </div>
  );
}
