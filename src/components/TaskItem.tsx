"use client";

import { useState } from "react";
import { TaskItemProps } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import CelebrationEffect from "@/components/ui/CelebrationEffect";
import { useToast } from "@/context/ToastContext";

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleCompletion,
  onDeleteTask,
  isCompleted = false,
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const { showToast } = useToast();

  const handleTaskCompletion = () => {
    // Only show celebration when marking a task as complete, not when unmarking
    if (!task.completed) {
      setShowCelebration(true);
      showToast(`Task "${task.title}" completed! 🎉`, "success");
    }
    onToggleCompletion(task.id);
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  return (
    <>
      <li
        className={`flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0 relative overflow-hidden group ${
          task.completed ? "bg-green-50" : ""
        }`}
      >
        <div className="flex items-center space-x-3 pr-2">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={handleTaskCompletion}
            aria-label={
              task.completed ? "Mark as incomplete" : "Mark as complete"
            }
            className="h-5 w-5 transition-all duration-300 hover:scale-110"
          />
          <label
            htmlFor={`task-${task.id}`}
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all duration-300 
            ${task.completed ? "line-through text-gray-500" : "text-gray-800"}
            ${task.completed ? "transform-gpu -translate-y-px" : ""}`}
          >
            {task.title}
          </label>
          {task.completed && (
            <span className="ml-2 text-green-500 text-xs font-medium">
              ✓ Completed
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteTask(task.id)}
          className="text-gray-400 hover:text-red-500 h-8 w-8 transition-colors duration-300"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </li>

      {/* Celebration effect */}
      <CelebrationEffect
        show={showCelebration}
        onComplete={handleCelebrationComplete}
      />
    </>
  );
};

export default TaskItem;
