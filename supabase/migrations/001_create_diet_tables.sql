-- Create enum types
CREATE TYPE user_role AS ENUM ('regular', 'premium', 'admin');
CREATE TYPE subscription_status AS ENUM ('free', 'premium');

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create diet_plans table
CREATE TABLE public.diet_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    thumbnail_url TEXT NOT NULL
);

-- Create meals table
CREATE TABLE public.meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diet_plan_id UUID REFERENCES diet_plans(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    nutritional_info JSONB NOT NULL,
    ingredients JSONB NOT NULL,
    preparation_steps TEXT[] NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS policies
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Policy for reading diet plans - Allow all authenticated users to read
CREATE POLICY "Enable read access for authenticated users"
    ON public.diet_plans
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy for reading meals - Allow all authenticated users to read
CREATE POLICY "Enable read access for authenticated users"
    ON public.meals
    FOR SELECT
    TO authenticated
    USING (true);

-- Insert some sample data
INSERT INTO public.diet_plans (title, description, is_premium, thumbnail_url) VALUES
(
    'Beginner''s Healthy Diet',
    'A perfect starting point for your healthy eating journey. This plan includes simple, nutritious meals that are easy to prepare.',
    false,
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061'
),
(
    'Premium Weight Loss Plan',
    'Advanced meal planning designed for optimal weight loss. Includes detailed macro tracking and portion control.',
    true,
    'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38'
);

-- Insert sample meals
INSERT INTO public.meals (
    diet_plan_id,
    name,
    description,
    nutritional_info,
    ingredients,
    preparation_steps,
    image_url
) VALUES
(
    (SELECT id FROM diet_plans WHERE title = 'Beginner''s Healthy Diet' LIMIT 1),
    'Healthy Breakfast Bowl',
    'A nutritious breakfast bowl with oats, fruits, and nuts',
    '{"calories": 350, "protein": 12, "carbs": 45, "fat": 14}'::jsonb,
    '[
        {"name": "Rolled Oats", "amount": 50, "unit": "g"},
        {"name": "Banana", "amount": 1, "unit": "piece"},
        {"name": "Almonds", "amount": 15, "unit": "g"},
        {"name": "Honey", "amount": 1, "unit": "tbsp"}
    ]'::jsonb,
    ARRAY[
        'Cook oats with water according to package instructions',
        'Slice the banana',
        'Top oats with banana slices',
        'Sprinkle chopped almonds',
        'Drizzle with honey'
    ],
    'https://images.unsplash.com/photo-1495214783159-3503fd1b572d'
); 