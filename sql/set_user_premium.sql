-- Set a user as premium by their email
-- Replace 'user@example.com' with the actual email

-- First update the auth.users metadata
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN 
      jsonb_build_object('is_premium', true)
    ELSE
      raw_user_meta_data || jsonb_build_object('is_premium', true)
  END
WHERE email = 'user@example.com';

-- Then make sure user_profiles table is updated
-- (in case triggers aren't working)
INSERT INTO public.user_profiles (id, email, is_premium)
SELECT 
  id, 
  email, 
  true
FROM auth.users
WHERE email = 'user@example.com'
ON CONFLICT (id) DO UPDATE SET
  is_premium = true,
  updated_at = NOW();

-- To verify the user is now premium, run:
-- SELECT * FROM user_profiles WHERE email = 'user@example.com'; 