import { supabase } from '@/services/supabase/client';
import { WorkoutPlan, Exercise, WorkoutPlanWithExercises } from '@/types/exercise';

interface CreateWorkoutPlanData {
  title: string;
  description: string;
  is_premium: boolean;
  thumbnail_url: string;
  video_url: string | null;
}

export const exerciseService = {
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getWorkoutPlanWithExercises(planId: string): Promise<WorkoutPlanWithExercises> {
    const { data: plan, error: planError } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) throw planError;

    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('*')
      .eq('workout_plan_id', planId)
      .order('created_at', { ascending: true });

    if (exercisesError) throw exercisesError;

    return {
      ...plan,
      exercises: exercises || [],
    };
  },

  async getExercise(exerciseId: string): Promise<Exercise> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', exerciseId)
      .single();

    if (error) throw error;
    return data;
  },

  async getFreeWorkoutPlans(): Promise<WorkoutPlan[]> {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('is_premium', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPremiumWorkoutPlans(): Promise<WorkoutPlan[]> {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('is_premium', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createWorkoutPlan(data: CreateWorkoutPlanData): Promise<WorkoutPlan> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('No user found');

    const { data: plan, error } = await supabase
      .from('workout_plans')
      .insert({
        ...data,
        created_by: userData.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return plan;
  },
}; 