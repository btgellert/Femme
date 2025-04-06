export interface PersonalTrainingPlan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface PersonalTrainingSession {
  id: string;
  plan_id: string;
  title: string;
  description: string;
  day_number: number;
  duration_minutes: number;
  is_completed: boolean;
  notes?: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PersonalTrainingPlanWithSessions extends PersonalTrainingPlan {
  sessions: PersonalTrainingSession[];
} 