"use client";

import { DaySummaryProps } from "@/lib/types";
import { format, parseISO } from "date-fns";

const DaySummary: React.FC<DaySummaryProps> = ({
  date,
  tasks,
  onViewDetails,
}) => {
  // Format the date for display
  const formattedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">{formattedDate}</h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-700">{totalTasks}</p>
          <p className="text-xs text-gray-600">Total Tasks</p>
        </div>

        <div className="bg-green-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
          <p className="text-xs text-gray-600">Completed</p>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
          <p className="text-xs text-gray-600">Pending</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tasks:</h4>

        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks for this day.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2 text-sm">
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    task.completed ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></span>
                <span
                  className={`${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-700"
                  }`}
                >
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onViewDetails}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default DaySummary;
