"use client";

import { useState } from "react";
import { CalendarProps, Task, DayStats } from "@/lib/types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  isSameDay,
} from "date-fns";
import CalendarDay from "./CalendarDay";
import DaySummary from "./DaySummary";

const Calendar: React.FC<CalendarProps> = ({
  tasks,
  selectedMonth,
  onMonthChange,
  onDayClick,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get days in the current month view
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of the week for the first day of the month (0-6, where 0 is Sunday)
  const startDay = monthStart.getDay();

  // Calculate days from previous month to display
  const daysFromPrevMonth = Array.from({ length: startDay }, (_, i) => {
    const day = new Date(monthStart);
    day.setDate(day.getDate() - (startDay - i));
    return day;
  });

  // Calculate days from next month to display (to fill a 6-row grid)
  const totalDaysToShow = 42; // 6 rows of 7 days
  const daysFromNextMonth = Array.from(
    { length: totalDaysToShow - daysInMonth.length - daysFromPrevMonth.length },
    (_, i) => {
      const day = new Date(monthEnd);
      day.setDate(day.getDate() + i + 1);
      return day;
    }
  );

  // Combine all days
  const allDays = [...daysFromPrevMonth, ...daysInMonth, ...daysFromNextMonth];

  // Navigate to previous month
  const goToPreviousMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  // Navigate to current month
  const goToCurrentMonth = () => {
    onMonthChange(new Date());
  };

  // Handle day click
  const handleDayClick = (date: string) => {
    setSelectedDate(date);
  };

  // Close the day summary modal
  const closeDaySummary = () => {
    setSelectedDate(null);
  };

  // View day details
  const viewDayDetails = () => {
    if (selectedDate) {
      onDayClick(selectedDate);
      setSelectedDate(null);
    }
  };

  // Get tasks for a specific day
  const getTasksForDay = (date: Date): Task[] => {
    const dateString = format(date, "yyyy-MM-dd");

    // Only include tasks that have a deadline on this date
    return tasks.filter((task) => {
      if (task.deadline) {
        // If the task has a deadline, check if it falls on this date
        try {
          return isSameDay(new Date(task.deadline), date);
        } catch (error) {
          console.error("Error comparing dates:", error);
          return false;
        }
      }

      // For backward compatibility, include tasks without deadlines that were created on this date
      return task.date === dateString;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Previous month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-xl font-semibold">
            {format(selectedMonth, "MMMM yyyy")}
          </h2>
          {!isSameMonth(selectedMonth, new Date()) && (
            <button
              onClick={goToCurrentMonth}
              className="text-sm text-primary hover:underline"
            >
              Go to Current Month
            </button>
          )}
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Next month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {allDays.map((day) => {
          const dateString = format(day, "yyyy-MM-dd");
          const dayTasks = getTasksForDay(day);

          return (
            <CalendarDay
              key={dateString}
              date={dateString}
              tasks={dayTasks}
              isCurrentMonth={isSameMonth(day, selectedMonth)}
              isToday={isToday(day)}
              onClick={() => handleDayClick(dateString)}
            />
          );
        })}
      </div>

      {/* Day summary modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto my-8 flex flex-col max-h-[90vh]">
            <div className="sticky top-0 bg-white z-10 flex justify-end p-2">
              <button
                onClick={closeDaySummary}
                className="text-gray-500 hover:text-gray-700 p-1"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-grow">
              <DaySummary
                date={selectedDate}
                tasks={tasks.filter((task) => {
                  if (task.deadline) {
                    // If the task has a deadline, check if it falls on this date
                    try {
                      return isSameDay(
                        new Date(task.deadline),
                        parseISO(selectedDate)
                      );
                    } catch (error) {
                      console.error("Error comparing dates:", error);
                      return false;
                    }
                  }

                  // For backward compatibility, include tasks without deadlines that were created on this date
                  return task.date === selectedDate;
                })}
                onViewDetails={viewDayDetails}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
