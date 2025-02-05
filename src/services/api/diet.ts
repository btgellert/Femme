import { supabase } from '../supabase/client';
import { DietPlan, Meal, DietPlanWithMeals } from '@/types/diet';

interface CreateDietPlanData {
  title: string;
  description: string;
  is_premium: boolean;
  thumbnail_url: string;
  video_url: string | null;
}

export const dietService = {
  async getDietPlans(): Promise<DietPlan[]> {
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getFreeDietPlans(): Promise<DietPlan[]> {
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('is_premium', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPremiumDietPlans(): Promise<DietPlan[]> {
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('is_premium', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getDietPlanWithMeals(planId: string): Promise<DietPlanWithMeals> {
    // Get the diet plan
    const { data: plan, error: planError } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError) throw planError;

    // Get the meals for this plan
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .eq('diet_plan_id', planId)
      .order('name');

    if (mealsError) throw mealsError;

    return {
      ...plan,
      meals: meals || [],
    };
  },

  async getMeal(mealId: string): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('id', mealId)
      .single();

    if (error) throw error;
    return data;
  },

  async createDietPlan(data: CreateDietPlanData): Promise<DietPlan> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user) throw new Error('No user found');

    const { data: plan, error } = await supabase
      .from('diet_plans')
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