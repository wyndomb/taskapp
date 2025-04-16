"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { format, addDays, subDays, parseISO, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface DayDetailProps {
  date: string;
  tasks: Task[];
  onDateChange: (date: string) => void;
  onAddTask: (title: string, date: string, deadline?: Date) => void;
  onToggleCompletion: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const DayDetail: React.FC<DayDetailProps> = ({
  date,
  tasks,
  onDateChange,
  onAddTask,
  onToggleCompletion,
  onDeleteTask,
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Filter tasks for the selected date
  const dayTasks = tasks.filter((task) => {
    try {
      // Match task date with the selected date string 'yyyy-MM-dd'
      return task.date === date;
    } catch (error) {
      console.error("Error filtering task by date:", error, task);
      return false;
    }
  });

  // Calculate stats (moved to main page, keeping filtering logic here)
  const activeTasks = dayTasks.filter((task) => !task.completed);
  const completedTasks = dayTasks.filter((task) => task.completed);

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

  // Format the date for display (Day Name and Full Date)
  const displayDay = format(parseISO(date), "EEEE");
  const displayDate = format(parseISO(date), "MMMM d, yyyy");

  // Handle adding a task and closing the modal
  const handleAddTask = (title: string, date: string, deadline?: Date) => {
    onAddTask(title, date, deadline);
    setShowTaskForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousDay}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">{displayDay}</h2>
          <p className="text-sm text-gray-500">{displayDate}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextDay}
          aria-label="Next day"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      {/* Active Tasks Section */}
      <div className="active-tasks-section">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Active Tasks</h3>
          <Button onClick={() => setShowTaskForm(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          {activeTasks.length > 0 ? (
            <TaskList
              tasks={activeTasks}
              onToggleCompletion={onToggleCompletion}
              onDeleteTask={onDeleteTask}
              currentDate={date}
            />
          ) : (
            <p className="text-center text-gray-500 py-4">
              No active tasks for today. Add a new task to get started!
            </p>
          )}
        </div>
      </div>

      {/* Completed Tasks Section */}
      <div className="completed-tasks-section">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Completed Tasks
        </h3>
        <div className="bg-white rounded-lg shadow p-4">
          {completedTasks.length > 0 ? (
            <TaskList
              tasks={completedTasks}
              onToggleCompletion={onToggleCompletion}
              onDeleteTask={onDeleteTask}
              isCompletedList={true}
              currentDate={date}
            />
          ) : (
            <p className="text-center text-gray-500 py-4">
              No completed tasks for today
            </p>
          )}
        </div>
      </div>

      {/* Task Form Modal (Styling adjustments might be needed in TaskForm itself) */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Task</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTaskForm(false)}
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
              </Button>
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
