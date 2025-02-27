"use client";

import { StatsProps } from "@/lib/types";
import { useEffect, useState } from "react";

const Stats: React.FC<StatsProps> = ({ stats }) => {
  // Use state to handle client-side rendering
  const [isClient, setIsClient] = useState(false);
  const [circleValues, setCircleValues] = useState({
    circumference: 0,
    offset: 0,
  });
  const [percentage, setPercentage] = useState(0);

  // Set up client-side calculations after component mounts
  useEffect(() => {
    // Calculate completion percentage for the circular progress based on the current day's tasks
    const totalTasksForDay = stats.completedToday + stats.totalActive;
    const completionPercentage =
      totalTasksForDay > 0
        ? Math.round((stats.completedToday / totalTasksForDay) * 100)
        : 0;

    // Calculate the stroke-dasharray and stroke-dashoffset for the SVG circle
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (completionPercentage / 100) * circumference;

    setCircleValues({ circumference, offset });
    setPercentage(completionPercentage);
    setIsClient(true);
  }, [stats.completedToday, stats.totalActive]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="stats-card bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-3xl font-bold text-primary">
          {isClient ? stats.completedToday : "0"}
        </p>
        <p className="text-sm text-gray-600">Completed Today</p>
      </div>

      <div className="stats-card bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-3xl font-bold text-secondary">
          {isClient ? stats.totalActive : "0"}
        </p>
        <p className="text-sm text-gray-600">Active Tasks</p>
      </div>

      <div className="stats-card bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center flex flex-col items-center justify-center">
        <div className="relative w-20 h-20">
          {isClient ? (
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#6366f1"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circleValues.circumference}
                strokeDashoffset={circleValues.offset}
                transform="rotate(-90 50 50)"
              />
              {/* Percentage text */}
              <text
                x="50"
                y="55"
                textAnchor="middle"
                fontSize="20"
                fontWeight="bold"
                fill="#6366f1"
              >
                {`${percentage}%`}
              </text>
            </svg>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-8 border-gray-200"></div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">Completion Rate</p>
      </div>
    </div>
  );
};

export default Stats;
