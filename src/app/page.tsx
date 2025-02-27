"use client";

import { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";
import DayDetail from "@/components/DayDetail";
import Calendar from "@/components/Calendar";

// TODO: Future optimizations:
// 1. Consider using a more persistent storage solution like IndexedDB for larger datasets
// 2. Implement pagination or virtualization if task lists grow very large
// 3. Add service worker for offline support
// 4. Consider server components for parts that don't need client interactivity

export default function Home() {
  // State for current view (day or calendar)
  const [currentView, setCurrentView] = useState<"day" | "calendar">("day");

  // State for selected date and month
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // State to track if component has mounted
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage only after component mounts on client
  useEffect(() => {
    try {
      // Load tasks from localStorage on client side
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        // Add date field to existing tasks if it doesn't exist
        setTasks(
          parsedTasks.map((task: any) => ({
            ...task,
            date: task.date || format(new Date(task.createdAt), "yyyy-MM-dd"),
            // Ensure dates are properly parsed
            createdAt: new Date(task.createdAt),
            completedAt: task.completedAt
              ? new Date(task.completedAt)
              : undefined,
            deadline: task.deadline ? new Date(task.deadline) : undefined,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      // If there's an error, start with an empty array
      setTasks([]);
    } finally {
      // Always set isLoaded to true, even if there was an error
      setIsLoaded(true);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
    }
  }, [tasks, isLoaded]);

  // Add a new task
  const addTask = (title: string, date: string, deadline?: Date) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
      date,
      deadline,
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

  // Handle date change in day view
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  // Handle month change in calendar view
  const handleMonthChange = (month: Date) => {
    setSelectedMonth(month);
  };

  // Handle day click in calendar view
  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setCurrentView("day");
  };

  // Handle view change
  const handleViewChange = (view: "day" | "calendar") => {
    setCurrentView(view);
  };

  // Create a sample task if there are no tasks and the app is loaded
  useEffect(() => {
    if (isLoaded && tasks.length === 0) {
      const today = format(new Date(), "yyyy-MM-dd");
      addTask(
        "Welcome to Joytask! Click the + button to add your first task",
        today
      );
    }
  }, [isLoaded, tasks.length]);

  // Loading state
  if (!isLoaded) {
    return (
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Joytask</h1>
          <p className="text-gray-600">Celebrate your accomplishments</p>
        </header>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Joytask</h1>
        <p className="text-gray-600">Celebrate your accomplishments</p>
      </header>

      <Navigation currentView={currentView} onViewChange={handleViewChange} />

      {currentView === "day" ? (
        <DayDetail
          date={selectedDate}
          tasks={tasks}
          onDateChange={handleDateChange}
          onAddTask={addTask}
          onToggleCompletion={toggleTaskCompletion}
          onDeleteTask={deleteTask}
        />
      ) : (
        <Calendar
          tasks={tasks}
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
          onDayClick={handleDayClick}
        />
      )}
    </div>
  );
}
