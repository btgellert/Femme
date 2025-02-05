export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  is_premium: boolean;
  thumbnail_url: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Exercise {
  id: string;
  workout_plan_id: string;
  name: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  sets: number | null;
  reps: number | null;
  duration_seconds: number | null;
  rest_seconds: number | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscle_groups: string[];
  equipment_needed: string[];
  instructions: string[];
  created_at: string;
  updated_at: string;
}

export interface WorkoutPlanWithExercises extends WorkoutPlan {
  exercises: Exercise[];
} 