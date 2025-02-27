"use client";

import { NavigationProps } from "@/lib/types";
import Link from "next/link";

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <nav className="bg-white shadow-sm mb-8 rounded-lg">
      <div className="flex justify-center">
        <div className="flex space-x-1 p-1">
          <button
            onClick={() => onViewChange("day")}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === "day"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => onViewChange("calendar")}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === "calendar"
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Calendar
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
