# Premium User Management Setup

This document explains how to set up and manage premium users in the Fitness App.

## Setting Up the Database

1. Open your Supabase dashboard for the project.
2. Go to the SQL Editor tab.
3. Copy the SQL from the file `sql/user_profiles_setup.sql` in this project.
4. Execute the SQL to create:
   - The `user_profiles` table
   - Triggers for user creation/updates
   - Functions for setting premium/admin status
   - Row-level security policies

## How to Make a User Premium

### Option 1: Using the Admin UI (Recommended)

1. Make yourself an admin first (using Option 2 below in SQL)
2. Log in to the app with your admin account
3. Navigate to the Profile tab
4. Under Admin Tools, tap "Manage Users"
5. Find the user you want to make premium
6. Toggle the switch next to their name to make them premium

### Option 2: Using SQL in Supabase Dashboard

You can directly set a user as premium using SQL:

```sql
-- To make a user premium
SELECT set_user_premium('USER_ID_HERE', true);

-- To make a user an admin (needed to manage other users)
SELECT set_user_admin('USER_ID_HERE', true);
```

Replace `USER_ID_HERE` with the actual user UUID.

### Option 3: Using the Supabase Dashboard

1. Go to the Authentication > Users section in your Supabase dashboard
2. Find the user you want to modify
3. Edit their user metadata and add:
   ```json
   {
     "is_premium": true
   }
   ```
4. For admin users, use:
   ```json
   {
     "is_premium": true,
     "role": "admin"
   }
   ```

## Verifying Premium Status

After setting a user as premium:

1. The user will have access to premium features in the app
2. Admin users can view all premium users in the "Add Training Plan" modal
3. Premium users will be able to see their training plans in the Training tab

## Database Structure

The `user_profiles` table has the following structure:

- `id`: UUID (same as the auth.users id)
- `email`: Text
- `is_premium`: Boolean
- `is_admin`: Boolean
- `created_at`: Timestamp
- `updated_at`: Timestamp

This table mirrors the user metadata and is kept in sync with auth.users via triggers.

## Troubleshooting

If you encounter issues:

1. Verify the `user_profiles` table was created successfully.
2. Check if the triggers are functioning by inserting a new user.
3. Ensure the functions have appropriate permissions.
4. Confirm that your RLS policies allow the operations you're trying to perform. 