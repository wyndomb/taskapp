"use client";

import { TaskListProps } from "@/lib/types";
import TaskItem from "./TaskItem";

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleCompletion,
  onDeleteTask,
  isCompletedList = false,
  currentDate,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        {isCompletedList ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 mb-1">No completed tasks yet</p>
            <p className="text-sm text-gray-400">
              Complete a task to see it here!
            </p>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-gray-500 mb-1">No active tasks</p>
            <p className="text-sm text-gray-400">
              Click the + button to add a new task
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onDeleteTask={onDeleteTask}
          isCompleted={isCompletedList}
          currentDate={currentDate}
        />
      ))}
    </div>
  );
};

export default TaskList;
