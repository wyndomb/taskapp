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
import WelcomeScreen from "@/components/WelcomeScreen";

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

  // State to track if local tasks have been migrated
  const [hasMigratedTasks, setHasMigratedTasks] = useState(false);

  // Track when the component was loaded
  const [loadTime] = useState(Date.now());

  // Get auth context
  const { user, isLoading: isAuthLoading } = useAuth();

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
          // We'll check if the user has the migrated flag - if they don't, they might be a new user
          const migrationFlag = localStorage.getItem(`migrated_${user.id}`);
          const isNewUser = migrationFlag !== "true";

          if (isNewLoginSession && isNewUser && userTasks.length > 0) {
            console.log(
              "Detected new user login with existing tasks. Clearing tasks for clean slate."
            );
            // Delete all existing tasks for this user
            for (const task of userTasks) {
              try {
                await deleteTaskFromDb(task.id);
              } catch (error) {
                console.error("Error deleting existing task:", error);
              }
            }
            // Set empty tasks array
            setTasks([]);
            return; // Exit early to avoid setting tasks with the existing data
          }

          setTasks(userTasks);

          // Only migrate local tasks if the user has no tasks in Supabase and hasn't migrated yet
          if (!hasMigratedTasks && userTasks.length === 0) {
            try {
              const localTasksJson = localStorage.getItem("tasks");
              if (localTasksJson) {
                const localTasks = JSON.parse(localTasksJson);

                // Add date field to existing tasks if it doesn't exist
                const formattedLocalTasks = localTasks.map((task: any) => {
                  try {
                    return {
                      ...task,
                      date:
                        task.date ||
                        format(new Date(task.createdAt), "yyyy-MM-dd"),
                      // Ensure dates are properly parsed
                      createdAt: new Date(task.createdAt),
                      completedAt: task.completedAt
                        ? new Date(task.completedAt)
                        : undefined,
                      deadline: task.deadline
                        ? new Date(task.deadline)
                        : undefined,
                    };
                  } catch (error) {
                    console.error("Error formatting local task:", error, task);
                    // Return a minimal valid task if there's an error
                    return {
                      ...task,
                      date: task.date || format(new Date(), "yyyy-MM-dd"),
                      createdAt: new Date(),
                    };
                  }
                });

                // Migrate local tasks to Supabase
                await migrateLocalTasks(user.id, formattedLocalTasks);

                // Clear localStorage after migration
                localStorage.removeItem("tasks");

                // Set migration flag
                setHasMigratedTasks(true);
                localStorage.setItem(`migrated_${user.id}`, "true");

                // Reload tasks from Supabase
                const updatedTasks = await getTasks(user.id);
                setTasks(updatedTasks);
              }
            } catch (migrationError) {
              console.error("Error during task migration:", migrationError);
              // Don't set the migration flag if there was an error
              // This will allow another attempt on next load
            }
          } else if (!hasMigratedTasks) {
            // User already has tasks in Supabase, just mark as migrated
            setHasMigratedTasks(true);
            localStorage.setItem(`migrated_${user.id}`, "true");
            // Clear localStorage to prevent future migrations
            localStorage.removeItem("tasks");
          }
        } else if (!isAuthLoading) {
          // User is not logged in, load tasks from localStorage
          try {
            const savedTasks = localStorage.getItem("tasks");
            if (savedTasks) {
              const parsedTasks = JSON.parse(savedTasks);

              // Add date field to existing tasks if it doesn't exist
              setTasks(
                parsedTasks.map((task: any) => {
                  try {
                    return {
                      ...task,
                      date:
                        task.date ||
                        format(new Date(task.createdAt), "yyyy-MM-dd"),
                      // Ensure dates are properly parsed
                      createdAt: new Date(task.createdAt),
                      completedAt: task.completedAt
                        ? new Date(task.completedAt)
                        : undefined,
                      deadline: task.deadline
                        ? new Date(task.deadline)
                        : undefined,
                    };
                  } catch (error) {
                    console.error("Error parsing task date:", error, task);
                    // Return a minimal valid task if there's an error
                    return {
                      ...task,
                      date: format(new Date(), "yyyy-MM-dd"),
                      createdAt: new Date(),
                    };
                  }
                })
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
        // If there's an error, start with an empty array
        setTasks([]);
      } finally {
        // Always set isLoaded to true, even if there was an error
        setIsLoaded(true);
      }
    };

    if (!isAuthLoading) {
      loadTasks();
    }
  }, [user, isAuthLoading, hasMigratedTasks]);

  // Save tasks to localStorage when they change (only if not logged in)
  useEffect(() => {
    if (isLoaded && !user) {
      try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
    }
  }, [tasks, isLoaded, user]);

  // Add a new task
  const addTask = async (title: string, date: string, deadline?: Date) => {
    // If a deadline is provided, use its date as the task date
    const taskDate = deadline ? format(deadline, "yyyy-MM-dd") : date;

    if (user) {
      // User is logged in, add task to Supabase
      try {
        const newTask = await addTaskToDb(user.id, title, taskDate, deadline);
        setTasks([...tasks, newTask]);
      } catch (error) {
        console.error("Error adding task to Supabase:", error);
      }
    } else {
      // User is not logged in, add task to localStorage
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
    // Find the task to toggle
    const taskToToggle = tasks.find((task) => task.id === id);
    if (!taskToToggle) return;

    // Update the task in state optimistically
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

    if (user) {
      // User is logged in, update task in Supabase
      try {
        await toggleTaskCompletionInDb(id, !taskToToggle.completed);
      } catch (error) {
        console.error("Error toggling task completion in Supabase:", error);
        // Revert the optimistic update if there's an error
        setTasks(
          tasks.map((task) => {
            if (task.id === id) {
              return taskToToggle;
            }
            return task;
          })
        );
      }
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    // Remove the task from state optimistically
    setTasks(tasks.filter((task) => task.id !== id));

    if (user) {
      // User is logged in, delete task from Supabase
      try {
        await deleteTaskFromDb(id);
      } catch (error) {
        console.error("Error deleting task from Supabase:", error);
        // If there's an error, fetch the tasks again to ensure consistency
        if (user) {
          const userTasks = await getTasks(user.id);
          setTasks(userTasks);
        }
      }
    }
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
    // Only create a welcome task for non-logged-in users who have no tasks
    // and have been using the app for at least 1 second (to avoid creating it during login transitions)
    const hasBeenLoadedForAWhile = isLoaded && Date.now() - loadTime > 1000;

    if (
      isLoaded &&
      tasks.length === 0 &&
      !isAuthLoading &&
      !user &&
      hasBeenLoadedForAWhile
    ) {
      const today = format(new Date(), "yyyy-MM-dd");
      addTask(
        "Welcome to Joytask! Click the + button to add your first task",
        today
      );
    }
  }, [isLoaded, tasks.length, isAuthLoading, user]);

  // Loading state
  if (!isLoaded || isAuthLoading) {
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

  // If user is not logged in, show welcome screen
  if (!user) {
    return (
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Joytask</h1>
          <p className="text-gray-600">Celebrate your accomplishments</p>
        </header>
        <WelcomeScreen />
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
