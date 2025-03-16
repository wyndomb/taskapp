import { supabase } from "./supabase";
import { Task } from "./types";
import { format } from "date-fns";

// Get all tasks for a user
export const getTasks = async (userId: string): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Convert database format to app format
    return data.map((task) => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      createdAt: new Date(task.created_at),
      completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
      deadline: task.deadline ? new Date(task.deadline) : undefined,
      date: task.date,
      user_id: task.user_id,
    }));
  } catch (error) {
    console.error("Error in getTasks:", error);
    throw error;
  }
};

// Add a new task
export const addTask = async (
  userId: string,
  title: string,
  date: string,
  deadline?: Date
): Promise<Task> => {
  try {
    const newTask = {
      title,
      completed: false,
      created_at: new Date().toISOString(),
      date,
      deadline: deadline?.toISOString() || null,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert(newTask)
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from insert operation");
    }

    // Convert database format to app format
    return {
      id: data.id,
      title: data.title,
      completed: data.completed,
      createdAt: new Date(data.created_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      date: data.date,
      user_id: data.user_id,
    };
  } catch (error) {
    console.error("Error in addTask:", error);
    throw error;
  }
};

// Toggle task completion
export const toggleTaskCompletion = async (
  taskId: string,
  completed: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("tasks")
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("id", taskId);

    if (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in toggleTaskCompletion:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteTask:", error);
    throw error;
  }
};

// Migrate localStorage tasks to Supabase
export const migrateLocalTasks = async (
  userId: string,
  localTasks: Task[]
): Promise<void> => {
  try {
    // Format tasks for Supabase
    const tasksToInsert = localTasks.map((task) => ({
      title: task.title,
      completed: task.completed,
      created_at: task.createdAt.toISOString(),
      completed_at: task.completedAt ? task.completedAt.toISOString() : null,
      deadline: task.deadline ? task.deadline.toISOString() : null,
      date: task.date,
      user_id: userId,
    }));

    if (tasksToInsert.length === 0) return;

    const { error } = await supabase.from("tasks").insert(tasksToInsert);

    if (error) {
      console.error("Error migrating tasks:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in migrateLocalTasks:", error);
    throw error;
  }
};
