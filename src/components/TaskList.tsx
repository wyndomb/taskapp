"use client";

import { TaskListProps } from "@/lib/types";
import TaskItem from "./TaskItem";

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleCompletion,
  onDeleteTask,
  isCompletedList = false,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500">
          {isCompletedList
            ? "No completed tasks yet. Complete a task to see it here!"
            : "No active tasks. Add a new task to get started!"}
        </p>
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
        />
      ))}
    </div>
  );
};

export default TaskList;
