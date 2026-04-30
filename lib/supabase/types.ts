// =============================================================================
// Database types — manually maintained to mirror supabase/migrations/*.sql
// Regenerate with `npx supabase gen types typescript` once a real project exists.
// =============================================================================

export type SubscriptionPlan = "module" | "all" | "semester";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "expired"
  | "trialing";

export const SubscriptionPlanLabels: Record<SubscriptionPlan, string> = {
  module: "Un modul",
  all: "Toate modulele",
  semester: "6 luni",
};

export type CourseDifficulty = "easy" | "medium" | "hard";

export type QuizType = "practice" | "exam_simulation";

export type AccessSource =
  | "subscription"
  | "manual"
  | "gift"
  | "scholarship";

export interface QuizOption {
  id: string;
  text: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          school: string | null;
          grade: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          school?: string | null;
          grade?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: SubscriptionPlan;
          status: SubscriptionStatus;
          current_period_start: string;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["subscriptions"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["subscriptions"]["Insert"]
        >;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          order_index: number;
          estimated_duration: string;
          difficulty: CourseDifficulty;
          icon: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["courses"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          slug: string;
          title: string;
          content: string;
          video_url: string | null;
          duration_minutes: number;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["lessons"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
        Relationships: [];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string | null;
          course_slug: string | null;
          lesson_slug: string | null;
          completed_at: string | null;
          time_spent_seconds: number;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["lesson_progress"]["Row"],
          "id" | "updated_at"
        > & { id?: string; updated_at?: string };
        Update: Partial<
          Database["public"]["Tables"]["lesson_progress"]["Insert"]
        >;
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          type: QuizType;
          time_limit_minutes: number | null;
          passing_score: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["quizzes"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["quizzes"]["Insert"]>;
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          quiz_id: string;
          question_text: string;
          options: QuizOption[];
          correct_option_id: string;
          explanation: string;
          topic_tag: string;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["questions"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["questions"]["Insert"]>;
        Relationships: [];
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string | null;
          course_slug: string | null;
          mode: "practice" | "exam" | null;
          started_at: string;
          completed_at: string | null;
          score: number | null;
          answers: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["quiz_attempts"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<
          Database["public"]["Tables"]["quiz_attempts"]["Insert"]
        >;
        Relationships: [];
      };
      course_access: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          granted_at: string;
          expires_at: string | null;
          source: AccessSource;
          source_id: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["course_access"]["Row"],
          "id" | "created_at"
        > & { id?: string; created_at?: string };
        Update: Partial<
          Database["public"]["Tables"]["course_access"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: {
      my_courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          order_index: number;
          estimated_duration: string;
          difficulty: CourseDifficulty;
          icon: string;
          granted_at: string;
          expires_at: string | null;
          source: AccessSource;
          is_active: boolean;
        };
        Relationships: [];
      };
    };
    Functions: {
      has_active_subscription: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      has_course_access: {
        Args: { p_course_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      subscription_plan: SubscriptionPlan;
      subscription_status: SubscriptionStatus;
      course_difficulty: CourseDifficulty;
      quiz_type: QuizType;
      access_source: AccessSource;
    };
    CompositeTypes: Record<string, never>;
  };
}
