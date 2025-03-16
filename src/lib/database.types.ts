export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          title: string;
          completed: boolean;
          created_at: string;
          completed_at: string | null;
          deadline: string | null;
          date: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          completed?: boolean;
          created_at?: string;
          completed_at?: string | null;
          deadline?: string | null;
          date: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          completed?: boolean;
          created_at?: string;
          completed_at?: string | null;
          deadline?: string | null;
          date?: string;
          user_id?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
