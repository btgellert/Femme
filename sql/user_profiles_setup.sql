-- Create user_profiles table to store user metadata
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own profile
CREATE POLICY user_profiles_select_policy ON user_profiles 
  FOR SELECT 
  USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

-- Create policy for users to update their own profile
CREATE POLICY user_profiles_update_policy ON user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

-- Create policy for admins to update any profile
CREATE POLICY admin_can_update_all_profiles ON user_profiles
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create policy for admins to insert profiles
CREATE POLICY admin_can_insert_profiles ON user_profiles
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Function to automatically create a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, is_premium, is_admin)
  VALUES (new.id, new.email, 
          COALESCE((new.raw_user_meta_data->>'is_premium')::boolean, false),
          COALESCE((new.raw_user_meta_data->>'role')::text = 'admin', false));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user_profiles when user metadata changes
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS trigger AS $$
BEGIN
  UPDATE public.user_profiles
  SET 
    email = new.email,
    is_premium = COALESCE((new.raw_user_meta_data->>'is_premium')::boolean, false),
    is_admin = COALESCE((new.raw_user_meta_data->>'role')::text = 'admin', false),
    updated_at = NOW()
  WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a user is updated
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Sample data: Insert current users into user_profiles
INSERT INTO public.user_profiles (id, email, is_premium, is_admin)
SELECT 
  id, 
  email, 
  COALESCE((raw_user_meta_data->>'is_premium')::boolean, false) as is_premium,
  COALESCE((raw_user_meta_data->>'role')::text = 'admin', false) as is_admin
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Create a function for admins to set users as premium
CREATE OR REPLACE FUNCTION public.set_user_premium(
  user_id UUID,
  premium_status BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  -- Update the user_profiles table
  UPDATE public.user_profiles
  SET 
    is_premium = premium_status,
    updated_at = NOW()
  WHERE id = user_id;
  
  -- Also update the user metadata in auth.users
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('is_premium', premium_status)
      ELSE
        raw_user_meta_data || jsonb_build_object('is_premium', premium_status)
    END
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to execute the function
GRANT EXECUTE ON FUNCTION public.set_user_premium TO authenticated;

-- Create a function for admins to set user as admin
CREATE OR REPLACE FUNCTION public.set_user_admin(
  user_id UUID,
  admin_status BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  -- Update the user_profiles table
  UPDATE public.user_profiles
  SET 
    is_admin = admin_status,
    updated_at = NOW()
  WHERE id = user_id;
  
  -- Also update the user metadata in auth.users
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('role', CASE WHEN admin_status THEN 'admin' ELSE null END)
      ELSE
        raw_user_meta_data || 
        jsonb_build_object('role', CASE WHEN admin_status THEN 'admin' ELSE null END)
    END
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions to execute the function
GRANT EXECUTE ON FUNCTION public.set_user_admin TO authenticated; 