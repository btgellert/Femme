import { supabase } from '../supabase/client';
import { PersonalTrainingPlan, PersonalTrainingSession, PersonalTrainingPlanWithSessions } from '@/types/training';

export const trainingService = {
  async getPersonalTrainingPlans(): Promise<PersonalTrainingPlan[]> {
    const { data, error } = await supabase
      .from('personal_training_plans')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getPersonalTrainingPlanWithSessions(planId: string): Promise<PersonalTrainingPlanWithSessions> {
    // Fetch the plan
    const { data: plan, error: planError } = await supabase
      .from('personal_training_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) throw planError;

    // Fetch the sessions for this plan
    const { data: sessions, error: sessionsError } = await supabase
      .from('personal_training_sessions')
      .select('*')
      .eq('plan_id', planId)
      .order('day_number', { ascending: true });

    if (sessionsError) throw sessionsError;

    return {
      ...plan,
      sessions: sessions || []
    };
  },

  async updateSessionCompletion(sessionId: string, isCompleted: boolean): Promise<void> {
    const { error } = await supabase
      .from('personal_training_sessions')
      .update({ is_completed: isCompleted })
      .eq('id', sessionId);

    if (error) throw error;
  },

  // Admin functions
  async createPersonalTrainingPlan(userId: string, plan: Partial<PersonalTrainingPlan>): Promise<PersonalTrainingPlan> {
    const { data, error } = await supabase
      .from('personal_training_plans')
      .insert({
        user_id: userId,
        title: plan.title,
        description: plan.description,
        start_date: plan.start_date,
        end_date: plan.end_date
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createTrainingSession(session: Partial<PersonalTrainingSession>): Promise<PersonalTrainingSession> {
    const { data, error } = await supabase
      .from('personal_training_sessions')
      .insert({
        plan_id: session.plan_id,
        title: session.title,
        description: session.description,
        day_number: session.day_number,
        duration_minutes: session.duration_minutes,
        notes: session.notes,
        video_url: session.video_url
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTrainingPlan(planId: string, plan: Partial<PersonalTrainingPlan>): Promise<void> {
    const { error } = await supabase
      .from('personal_training_plans')
      .update({
        title: plan.title,
        description: plan.description,
        start_date: plan.start_date,
        end_date: plan.end_date
      })
      .eq('id', planId);

    if (error) throw error;
  },

  async deleteTrainingPlan(planId: string): Promise<void> {
    const { error } = await supabase
      .from('personal_training_plans')
      .delete()
      .eq('id', planId);

    if (error) throw error;
  }
}; 