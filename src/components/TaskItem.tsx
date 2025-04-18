"use client";

import { useState, useEffect, useRef, memo } from "react";
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
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const { showToast } = useToast();
  const prevCompletedRef = useRef(task.completed);

  useEffect(() => {
    // Only trigger when transitioning from incomplete to complete
    if (!prevCompletedRef.current && task.completed) {
      setShowCelebration(true);
      showToast(`Task "${task.title}" completed! 🎉`, "success");
    }
    prevCompletedRef.current = task.completed;
  }, [task.completed, task.title, showToast]);

  const handleTaskCompletion = () => {
    onToggleCompletion(task.id);
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  return (
    <>
      <li
        className={`flex items-center justify-between px-4 py-2 border-b border-gray-200 last:border-b-0 relative overflow-hidden group ${
          task.completed ? "bg-green-50" : ""
        }`}
      >
        <div className="flex items-center space-x-3 pr-2 flex-1 min-w-0">
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
            className={`break-words whitespace-normal text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all duration-300 
            ${task.completed ? "line-through text-gray-500" : "text-gray-800"}
            ${task.completed ? "transform-gpu -translate-y-px" : ""}`}
            style={{ maxWidth: "100%" }}
          >
            {task.title}
          </label>
        </div>
        {task.completed && (
          <span className="ml-2 text-green-500 text-xs font-medium whitespace-nowrap">
            ✓ Completed
          </span>
        )}
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

export default memo(TaskItem);
