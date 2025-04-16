"use client";

import { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";
import DayDetail from "@/components/DayDetail";
import Calendar from "@/components/Calendar";
import { useAuth } from "@/context/AuthContext";
import {
  getTasks,
  addTask as addTaskToDb,
  toggleTaskCompletion as toggleTaskCompletionInDb,
  deleteTask as deleteTaskFromDb,
  migrateLocalTasks,
} from "@/lib/taskService";
import { BarChart } from "@/components/ui/BarChart";
import { CheckCircle } from "@/components/ui/CheckCircle";
import { Circle } from "@/components/ui/Circle";
import LandingPage from "@/components/LandingPage";
import { useToast } from "@/context/ToastContext";

// Define a type for raw task data from localStorage
interface RawTaskData {
  id: string;
  userId?: string;
  title: string;
  completed: boolean;
  createdAt: string; // Expect string initially
  completedAt?: string; // Expect string initially
  deadline?: string; // Expect string initially
  date?: string; // Expect string initially
}

// TODO: Future optimizations:
// 1. Consider using a more persistent storage solution like IndexedDB for larger datasets
// 2. Implement pagination or virtualization if task lists grow very large
// 3. Add service worker for offline support

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

  // State to track if local tasks have been migrated
  const [hasMigratedTasks, setHasMigratedTasks] = useState(false);

  // Get auth context
  const { user, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  // Initialize migration flag from localStorage
  useEffect(() => {
    if (user) {
      const migrationFlag = localStorage.getItem(`migrated_${user.id}`);
      if (migrationFlag === "true") {
        setHasMigratedTasks(true);
      }
    }
  }, [user]);

  // Load tasks from Supabase or localStorage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (user) {
          // User is logged in, load tasks from Supabase
          const userTasks = await getTasks(user.id);

          // Check if this is a new login session
          const lastLoginUserId = localStorage.getItem("last_login_user_id");
          const isNewLoginSession = lastLoginUserId !== user.id;

          // Always store the current user ID for future reference
          localStorage.setItem("last_login_user_id", user.id);

          // Only clear tasks if this is a new user who has tasks that might belong to a deleted account
          const migrationFlag = localStorage.getItem(`migrated_${user.id}`);
          const isNewUser = migrationFlag !== "true";

          if (isNewLoginSession && isNewUser && userTasks.length > 0) {
            console.log(
              "Detected new user login with existing tasks. Clearing tasks for clean slate."
            );
            // Risky deletion logic removed as per code review plan
            // The check is kept for debugging purposes only
          }

          setTasks(userTasks);

          // Task migration logic
          if (!hasMigratedTasks && userTasks.length === 0) {
            try {
              const localTasksJson = localStorage.getItem("tasks");
              if (localTasksJson) {
                const localTasks = JSON.parse(localTasksJson);
                const formattedLocalTasks = localTasks.map(
                  (task: RawTaskData) => ({
                    ...task,
                    date:
                      task.date ||
                      format(new Date(task.createdAt), "yyyy-MM-dd"),
                    createdAt: new Date(task.createdAt),
                    completedAt: task.completedAt
                      ? new Date(task.completedAt)
                      : undefined,
                    deadline: task.deadline
                      ? new Date(task.deadline)
                      : undefined,
                  })
                );

                const migrationSuccess = await migrateLocalTasks(
                  user.id,
                  formattedLocalTasks
                );
                if (migrationSuccess) {
                  localStorage.removeItem("tasks");
                  setHasMigratedTasks(true);
                  localStorage.setItem(`migrated_${user.id}`, "true");

                  const updatedTasks = await getTasks(user.id);
                  setTasks(updatedTasks);
                } else {
                  showToast(
                    "Task migration from local storage failed. Please reload or contact support if issue persists.",
                    "error"
                  );
                }
              }
            } catch (migrationError) {
              console.error("Error during task migration:", migrationError);
              showToast(
                "Task migration from local storage failed. Please reload or contact support if issue persists.",
                "error"
              );
            }
          } else if (!hasMigratedTasks) {
            setHasMigratedTasks(true);
            localStorage.setItem(`migrated_${user.id}`, "true");
            localStorage.removeItem("tasks");
          }
        } else if (!isAuthLoading) {
          // User is not logged in, load tasks from localStorage
          try {
            const savedTasks = localStorage.getItem("tasks");
            if (savedTasks) {
              const parsedTasks = JSON.parse(savedTasks);
              setTasks(
                parsedTasks.map((task: RawTaskData) => ({
                  ...task,
                  date:
                    task.date || format(new Date(task.createdAt), "yyyy-MM-dd"),
                  createdAt: new Date(task.createdAt),
                  completedAt: task.completedAt
                    ? new Date(task.completedAt)
                    : undefined,
                  deadline: task.deadline ? new Date(task.deadline) : undefined,
                }))
              );
            }
          } catch (localStorageError) {
            console.error(
              "Error loading tasks from localStorage:",
              localStorageError
            );
            setTasks([]);
          }
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
        setTasks([]);
      } finally {
        setIsLoaded(true);
      }
    };

    if (!isAuthLoading) {
      loadTasks();
    }
  }, [user, isAuthLoading, hasMigratedTasks, showToast]);

  // Save tasks to localStorage when they change (only if not logged in)
  useEffect(() => {
    if (isLoaded && !user) {
      try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
        // Optionally show a toast message here if saving fails
        // showToast("Failed to save tasks locally.", "error"); // Uncomment if needed
      }
    }
  }, [tasks, isLoaded, user, showToast]);

  // Add a new task
  const addTask = async (title: string, date: string, deadline?: Date) => {
    const taskDate = deadline ? format(deadline, "yyyy-MM-dd") : date;
    if (user) {
      try {
        const newTask = await addTaskToDb(user.id, title, taskDate, deadline);
        setTasks([...tasks, newTask]);
      } catch (error) {
        console.error("Error adding task to Supabase:", error);
      }
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        completed: false,
        createdAt: new Date(),
        date: taskDate,
        deadline,
      };
      setTasks([...tasks, newTask]);
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (id: string) => {
    const taskToToggle = tasks.find((task) => task.id === id);
    if (!taskToToggle) return;

    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined,
          }
        : task
    );
    setTasks(updatedTasks);

    if (user) {
      try {
        await toggleTaskCompletionInDb(id, !taskToToggle.completed);
      } catch (error) {
        console.error("Error toggling task completion in Supabase:", error);
        // Revert optimistic update on error
        setTasks(tasks);
      }
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    const originalTasks = [...tasks];
    setTasks(tasks.filter((task) => task.id !== id));
    if (user) {
      try {
        await deleteTaskFromDb(id);
      } catch (error) {
        console.error("Error deleting task from Supabase:", error);
        // Revert optimistic update on error
        setTasks(originalTasks);
      }
    }
  };

  // Handle date change
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  // Handle month change
  const handleMonthChange = (month: Date) => {
    setSelectedMonth(month);
    setCurrentView("calendar");
  };

  // Handle day click
  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    setCurrentView("day");
  };

  // Handle view change
  const handleViewChange = (view: "day" | "calendar") => {
    setCurrentView(view);
  };

  // Conditional rendering based on auth state
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    // Use the LandingPage component for non-logged-in users
    return <LandingPage />;
  }

  // Calculate stats for the top section
  const todaysTasks = tasks.filter((task) => task.date === selectedDate);
  const activeTasksCount = todaysTasks.filter((task) => !task.completed).length;
  const completedTasksCount = todaysTasks.filter(
    (task) => task.completed
  ).length;
  const totalTasksCount = todaysTasks.length;
  const completionPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
        <p className="text-gray-500">
          Organize your day and boost productivity
        </p>
      </header>

      {/* Re-integrated Navigation */}
      <Navigation currentView={currentView} onViewChange={handleViewChange} />

      {/* Task Summary */}
      {currentView === "day" && (
        <div className="bg-white rounded-lg shadow p-6 mb-8 flex justify-around items-center text-center">
          <div className="flex flex-col items-center">
            <Circle className="w-10 h-10 text-blue-500 mb-2" />
            <span className="text-2xl font-semibold text-gray-700">
              {activeTasksCount}
            </span>
            <span className="text-sm text-gray-500">Active Tasks</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
            <span className="text-2xl font-semibold text-gray-700">
              {completedTasksCount}
            </span>
            <span className="text-sm text-gray-500">Completed</span>
          </div>
          <div className="flex flex-col items-center">
            <BarChart className="w-10 h-10 text-purple-500 mb-2" />
            <span className="text-2xl font-semibold text-gray-700">
              {completionPercentage}%
            </span>
            <span className="text-sm text-gray-500">Completion</span>
          </div>
        </div>
      )}

      {/* Conditional rendering based on currentView */}
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
