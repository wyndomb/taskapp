"use client";

import { useState } from "react";
import { DayDetailProps, Task, DayStats } from "@/lib/types";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import Stats from "./Stats";
import { format, addDays, subDays, parseISO, isSameDay } from "date-fns";

interface DayDetailComponentProps extends DayDetailProps {
  tasks: Task[];
  onAddTask: (title: string, date: string, deadline?: Date) => void;
  onToggleCompletion: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const DayDetail: React.FC<DayDetailComponentProps> = ({
  date,
  tasks,
  onDateChange,
  onAddTask,
  onToggleCompletion,
  onDeleteTask,
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Filter tasks for the selected date
  // Include tasks that were created on this date OR have a deadline on this date
  const dayTasks = tasks.filter((task) => {
    const taskDate = task.date;

    // If the task has a deadline, it should only appear on that specific date
    if (task.deadline) {
      const taskDeadline = format(new Date(task.deadline), "yyyy-MM-dd");
      return taskDeadline === date;
    }

    // If no deadline, show on the date it was created for
    return taskDate === date;
  });

  // Calculate stats for the day
  const dayStats = {
    completedToday: tasks.filter(
      (task) =>
        task.completed &&
        task.completedAt &&
        format(new Date(task.completedAt), "yyyy-MM-dd") === date
    ).length,
    totalCompleted: tasks.filter((task) => task.completed).length,
    totalActive: dayTasks.filter((task) => !task.completed).length,
  };

  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = format(subDays(parseISO(date), 1), "yyyy-MM-dd");
    onDateChange(newDate);
  };

  // Navigate to next day
  const goToNextDay = () => {
    const newDate = format(addDays(parseISO(date), 1), "yyyy-MM-dd");
    onDateChange(newDate);
  };

  // Navigate to today
  const goToToday = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    onDateChange(today);
  };

  // Format the date for display
  const formattedDate = format(parseISO(date), "EEEE, MMMM d, yyyy");
  const isToday = date === format(new Date(), "yyyy-MM-dd");

  // Get active and completed tasks for the day
  const activeTasks = dayTasks.filter((task) => !task.completed);
  const completedTasks = dayTasks.filter((task) => task.completed);

  // Handle adding a task and closing the modal
  const handleAddTask = (title: string, date: string, deadline?: Date) => {
    onAddTask(title, date, deadline);
    setShowTaskForm(false);
  };

  return (
    <div className="space-y-6 relative pb-16">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousDay}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Previous day"
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
          <h2 className="text-xl font-semibold">{formattedDate}</h2>
          {!isToday && (
            <button
              onClick={goToToday}
              className="text-sm text-primary hover:underline"
            >
              Go to Today
            </button>
          )}
        </div>

        <button
          onClick={goToNextDay}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Next day"
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

      <Stats stats={dayStats} />

      <div className="task-lists-container">
        <div className="task-list-active mb-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Active Tasks
          </h2>
          <TaskList
            tasks={activeTasks}
            onToggleCompletion={onToggleCompletion}
            onDeleteTask={onDeleteTask}
            currentDate={date}
          />
        </div>

        <div className="task-list-completed">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Completed Tasks
          </h2>
          <TaskList
            tasks={completedTasks}
            onToggleCompletion={onToggleCompletion}
            onDeleteTask={onDeleteTask}
            isCompletedList={true}
            currentDate={date}
          />
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowTaskForm(true)}
        className="fab"
        aria-label="Add new task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-4 bg-primary text-white flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Task</h2>
              <button
                onClick={() => setShowTaskForm(false)}
                className="text-white hover:text-gray-200"
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
            <div className="p-4">
              <TaskForm onAddTask={handleAddTask} selectedDate={date} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayDetail;
