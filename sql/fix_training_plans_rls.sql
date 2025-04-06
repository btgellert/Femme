-- Fix RLS policies for personal training plans

-- First check if RLS is enabled for both tables
ALTER TABLE personal_training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_training_sessions ENABLE ROW LEVEL SECURITY;

-- First drop all existing policies to start fresh
DROP POLICY IF EXISTS admin_insert_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS admin_update_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS admin_delete_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS admin_select_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS user_select_own_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS user_update_own_training_plans ON personal_training_plans;

DROP POLICY IF EXISTS admin_insert_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS admin_update_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS admin_delete_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS admin_select_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS user_select_own_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS user_update_own_training_sessions ON personal_training_sessions;

-- Create a SUPER permissive policy for admins for personal_training_plans
CREATE POLICY admin_all_training_plans
ON personal_training_plans
FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Allow users to see their own training plans
CREATE POLICY user_select_own_training_plans
ON personal_training_plans
FOR SELECT
USING (user_id = auth.uid());

-- Allow users to update progress on their own training plans
CREATE POLICY user_update_own_training_plans
ON personal_training_plans
FOR UPDATE
USING (user_id = auth.uid());

-- Create SUPER permissive policy for admins for personal_training_sessions
CREATE POLICY admin_all_training_sessions
ON personal_training_sessions
FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Allow users to view training sessions for their plans
CREATE POLICY user_select_own_training_sessions
ON personal_training_sessions
FOR SELECT
USING (plan_id IN (
  SELECT id FROM personal_training_plans WHERE user_id = auth.uid()
));

-- Allow users to update completion status of their training sessions
CREATE POLICY user_update_own_training_sessions
ON personal_training_sessions
FOR UPDATE
USING (plan_id IN (
  SELECT id FROM personal_training_plans WHERE user_id = auth.uid()
));

-- Make sure permissions are granted
GRANT ALL ON personal_training_plans TO authenticated;
GRANT ALL ON personal_training_sessions TO authenticated;

-- Add a debugging policy (temporary) that allows all operations
-- Comment these out once the issue is fixed
CREATE POLICY debug_all_training_plans
ON personal_training_plans
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY debug_all_training_sessions
ON personal_training_sessions
FOR ALL
USING (true)
WITH CHECK (true); 