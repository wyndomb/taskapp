export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  deadline?: Date;
}

export interface StatsProps {
  stats: {
    completedToday: number;
    totalCompleted: number;
    totalActive: number;
  };
}

export interface TaskFormProps {
  onAddTask: (title: string, deadline?: Date) => void;
}

export interface TaskListProps {
  tasks: Task[];
  onToggleCompletion: (id: string) => void;
  onDeleteTask: (id: string) => void;
  isCompletedList?: boolean;
}

export interface TaskItemProps {
  task: Task;
  onToggleCompletion: (id: string) => void;
  onDeleteTask: (id: string) => void;
  isCompleted?: boolean;
}
