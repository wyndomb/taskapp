"use client";

import { useState, useEffect } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import Stats from "@/components/Stats";
import { Task } from "@/lib/types";
import { format } from "date-fns";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on client side
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
    return [];
  });

  const [stats, setStats] = useState({
    completedToday: 0,
    totalCompleted: 0,
    totalActive: 0,
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateStats();
  }, [tasks]);

  // Update statistics
  const updateStats = () => {
    const today = format(new Date(), "yyyy-MM-dd");

    const completedToday = tasks.filter(
      (task) =>
        task.completed &&
        format(new Date(task.completedAt || ""), "yyyy-MM-dd") === today
    ).length;

    const totalCompleted = tasks.filter((task) => task.completed).length;
    const totalActive = tasks.filter((task) => !task.completed).length;

    setStats({ completedToday, totalCompleted, totalActive });
  };

  // Add a new task
  const addTask = (title: string, deadline?: Date) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
      deadline: deadline,
    };
    setTasks([...tasks, newTask]);
  };

  // Toggle task completion status
  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined,
          };
        }
        return task;
      })
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Get active and completed tasks
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Joytask</h1>
        <p className="text-gray-600">Celebrate your accomplishments</p>
      </header>

      <Stats stats={stats} />

      <TaskForm onAddTask={addTask} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Active Tasks
          </h2>
          <TaskList
            tasks={activeTasks}
            onToggleCompletion={toggleTaskCompletion}
            onDeleteTask={deleteTask}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Completed Tasks
          </h2>
          <TaskList
            tasks={completedTasks}
            onToggleCompletion={toggleTaskCompletion}
            onDeleteTask={deleteTask}
            isCompletedList={true}
          />
        </div>
      </div>
    </div>
  );
}
