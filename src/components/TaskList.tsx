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
  return (
    <ul className="space-y-2 list-none p-0 m-0">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onDeleteTask={onDeleteTask}
          isCompleted={task.completed}
          currentDate={currentDate}
        />
      ))}
    </ul>
  );
};

export default TaskList;
