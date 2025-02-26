"use client";

import { useState } from "react";
import { TaskFormProps } from "@/lib/types";

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [showDeadline, setShowDeadline] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim()) {
      onAddTask(title.trim(), deadline ? new Date(deadline) : undefined);

      // Reset form
      setTitle("");
      setDeadline("");
      setShowDeadline(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Add New Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
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
          <div>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        <div>
          <button type="submit" className="btn btn-primary">
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
