export interface DietPlan {
  id: string;
  title: string;
  description: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  thumbnail_url: string;
}

export interface Meal {
  id: string;
  diet_plan_id: string;
  name: string;
  description: string;
  nutritional_info: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  preparation_steps: string[];
  image_url: string;
}

export interface DietPlanWithMeals extends DietPlan {
  meals: Meal[];
} 