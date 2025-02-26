"use client";

import { StatsProps } from "@/lib/types";

const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-3xl font-bold text-primary">
          {stats.completedToday}
        </p>
        <p className="text-sm text-gray-600">Completed Today</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-3xl font-bold text-secondary">
          {stats.totalCompleted}
        </p>
        <p className="text-sm text-gray-600">Total Completed</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-3xl font-bold text-gray-700">{stats.totalActive}</p>
        <p className="text-sm text-gray-600">Active Tasks</p>
      </div>
    </div>
  );
};

export default Stats;
