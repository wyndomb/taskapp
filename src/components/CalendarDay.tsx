"use client";

import { CalendarDayProps } from "@/lib/types";
import { format, parseISO } from "date-fns";

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  tasks,
  isCurrentMonth,
  isToday,
  onClick,
}) => {
  // Get the day number
  const dayNumber = format(parseISO(date), "d");

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Determine the background color based on task status
  let bgColor = "bg-white";
  if (isToday) {
    bgColor = "bg-blue-50";
  } else if (completedTasks > 0 && pendingTasks === 0 && totalTasks > 0) {
    bgColor = "bg-green-50"; // All tasks completed
  } else if (pendingTasks > 0) {
    bgColor = "bg-yellow-50"; // Has pending tasks
  }

  // Limit the number of tasks to display
  const displayLimit = 1;
  const displayTasks = tasks.slice(0, displayLimit);
  const hasMoreTasks = totalTasks > displayLimit;

  return (
    <div
      onClick={onClick}
      className={`${bgColor} p-2 min-h-[80px] ${
        isCurrentMonth ? "text-gray-800" : "text-gray-400"
      } ${
        isToday ? "ring-2 ring-primary" : ""
      } hover:bg-gray-50 cursor-pointer transition-colors`}
    >
      <div className="flex justify-between items-start">
        <span
          className={`text-sm font-medium ${
            isToday
              ? "bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center"
              : ""
          }`}
        >
          {dayNumber}
        </span>

        {totalTasks > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
            {completedTasks}/{totalTasks}
          </span>
        )}
      </div>

      <div className="mt-1 space-y-1">
        {displayTasks.map((task) => (
          <div
            key={task.id}
            className={`text-xs truncate ${
              task.completed ? "line-through text-gray-500" : "text-gray-700"
            }`}
          >
            {task.title}
          </div>
        ))}

        {hasMoreTasks && (
          <div className="text-xs text-gray-500 font-medium">
            +{totalTasks - displayLimit} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
