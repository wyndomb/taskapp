"use client";

import { TaskItemProps } from "@/lib/types";
import { format } from "date-fns";

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleCompletion,
  onDeleteTask,
  isCompleted = false,
}) => {
  // Format the deadline if it exists
  const formattedDeadline = task.deadline
    ? format(new Date(task.deadline), "MMM d, yyyy h:mm a")
    : null;

  // Format the completion date if it exists
  const formattedCompletionDate = task.completedAt
    ? format(new Date(task.completedAt), "MMM d, yyyy h:mm a")
    : null;

  return (
    <div
      className={`task-item ${task.completed ? "task-completed" : ""} relative`}
    >
      {/* Task completion toggle */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleCompletion(task.id)}
          className="mt-1 flex-shrink-0 h-5 w-5 rounded-full border border-gray-400 flex items-center justify-center"
          aria-label={
            task.completed ? "Mark as incomplete" : "Mark as complete"
          }
        >
          {task.completed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-secondary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <h3
            className={`font-medium ${
              task.completed ? "line-through text-gray-500" : ""
            }`}
          >
            {task.title}
          </h3>

          {/* Show deadline for active tasks */}
          {!task.completed && formattedDeadline && (
            <div className="mt-1 text-sm text-gray-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Due: {formattedDeadline}
            </div>
          )}

          {/* Show completion date for completed tasks */}
          {task.completed && formattedCompletionDate && (
            <div className="mt-1 text-sm text-gray-600 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Completed: {formattedCompletionDate}
            </div>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete task"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Celebration animation for newly completed tasks */}
      {task.completed && isCompleted && (
        <div className="absolute -top-2 -right-2 text-xl animate-bounce-slow">
          🎉
        </div>
      )}
    </div>
  );
};

export default TaskItem;
