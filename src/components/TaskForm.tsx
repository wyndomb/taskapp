"use client";

import { useState } from "react";
import { TaskFormProps } from "@/lib/types";
import { format, parseISO, setHours, setMinutes, setSeconds } from "date-fns";

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, selectedDate }) => {
  const [title, setTitle] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [showDeadline, setShowDeadline] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim()) {
      let finalDeadline;
      let taskDate = selectedDate; // Default to the selected date

      if (deadlineDate) {
        try {
          // Create a date object from the deadline date
          const dateObj = new Date(deadlineDate);

          // If time is provided, set it; otherwise, set to end of day (23:59:59)
          if (deadlineTime) {
            const [hours, minutes] = deadlineTime.split(":").map(Number);
            finalDeadline = setHours(setMinutes(dateObj, minutes), hours);
          } else {
            finalDeadline = setHours(
              setMinutes(setSeconds(dateObj, 59), 59),
              23
            );
          }

          // Ensure the date is valid
          if (isNaN(finalDeadline.getTime())) {
            console.error("Invalid date created:", finalDeadline);
            finalDeadline = undefined;
          } else {
            // Use the deadline date as the task date (YYYY-MM-DD format)
            taskDate = format(finalDeadline, "yyyy-MM-dd");
          }
        } catch (error) {
          console.error("Error creating deadline date:", error);
          finalDeadline = undefined;
        }
      }

      onAddTask(title.trim(), taskDate, finalDeadline);

      // Reset form
      setTitle("");
      setDeadlineDate("");
      setDeadlineTime("");
      setShowDeadline(false);
    }
  };

  // Format the selected date for display
  const formattedDate = format(parseISO(selectedDate), "EEEE, MMMM d");

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">for {formattedDate}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
            autoFocus
          />
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setShowDeadline(!showDeadline)}
            className="text-sm text-primary flex items-center"
          >
            {showDeadline ? "Hide deadline" : "Add deadline"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {showDeadline && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time (optional)
              </label>
              <input
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                If no time is selected, deadline will be set to end of day
                (11:59 PM)
              </p>
            </div>
          </div>
        )}

        <div>
          <button type="submit" className="btn btn-primary w-full">
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
