export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  deadline?: Date;
  date: string; // The date this task is associated with (YYYY-MM-DD format)
  user_id?: string; // The ID of the user who owns this task
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface StatsProps {
  stats: {
    completedToday: number;
    totalCompleted: number;
    totalActive: number;
  };
}

export interface DayStats {
  total: number;
  completed: number;
  pending: number;
}

export interface TaskFormProps {
  onAddTask: (title: string, date: string, deadline?: Date) => void;
  selectedDate: string;
}

export interface TaskListProps {
  tasks: Task[];
  onToggleCompletion: (id: string) => void;
  onDeleteTask: (id: string) => void;
  isCompletedList?: boolean;
  currentDate?: string;
}

export interface TaskItemProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onDeleteTask: (id: string) => void;
  isCompleted?: boolean;
  currentDate?: string;
}

export interface DayDetailProps {
  date: string;
  onDateChange: (date: string) => void;
}

export interface CalendarDayProps {
  date: string;
  tasks: Task[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: () => void;
}

export interface CalendarProps {
  tasks: Task[];
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
  onDayClick: (date: string) => void;
}

export interface DaySummaryProps {
  date: string;
  tasks: Task[];
  onViewDetails: () => void;
}

export interface NavigationProps {
  currentView: "day" | "calendar";
  onViewChange: (view: "day" | "calendar") => void;
}
