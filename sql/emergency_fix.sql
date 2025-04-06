-- EMERGENCY FIX: Temporarily disable RLS to allow operations

-- 1. Disable RLS for both tables
ALTER TABLE personal_training_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE personal_training_sessions DISABLE ROW LEVEL SECURITY;

-- 2. Drop any conflicting policies
DROP POLICY IF EXISTS admin_insert_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS admin_update_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS admin_delete_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS admin_select_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS admin_all_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS user_select_own_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS user_update_own_training_plans ON personal_training_plans;
DROP POLICY IF EXISTS debug_all_training_plans ON personal_training_plans;

DROP POLICY IF EXISTS admin_insert_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS admin_update_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS admin_delete_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS admin_select_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS admin_all_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS user_select_own_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS user_update_own_training_sessions ON personal_training_sessions;
DROP POLICY IF EXISTS debug_all_training_sessions ON personal_training_sessions;

-- 3. Ensure all necessary permissions are granted
GRANT ALL ON personal_training_plans TO authenticated;
GRANT ALL ON personal_training_sessions TO authenticated;
GRANT ALL ON personal_training_plans TO anon;
GRANT ALL ON personal_training_sessions TO anon;
GRANT ALL ON personal_training_plans TO service_role;
GRANT ALL ON personal_training_sessions TO service_role;

-- 4. Enable RLS (commented out for now - uncomment after testing)
-- ALTER TABLE personal_training_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE personal_training_sessions ENABLE ROW LEVEL SECURITY;

-- 5. Create the most permissive policy possible (uncomment when re-enabling RLS)
-- CREATE POLICY allow_all_plans ON personal_training_plans FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY allow_all_sessions ON personal_training_sessions FOR ALL USING (true) WITH CHECK (true);

-- IMPORTANT: After confirming everything works:
-- 1. Re-enable RLS by uncommenting lines in step 4
-- 2. Add proper policies by uncommenting lines in step 5
-- 3. Run this script again
-- 4. Later, replace these permissive policies with proper ones 