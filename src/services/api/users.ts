import { supabase } from '../supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  is_premium: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export const userService = {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('email');
    
    if (error) {
      console.error('Error getting users:', error);
      throw error;
    }
    
    return data || [];
  },

  /**
   * Get a user by ID
   */
  async getUserById(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error getting user:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Set a user's premium status (admin only)
   */
  async setUserPremium(userId: string, isPremium: boolean): Promise<void> {
    const { error } = await supabase
      .rpc('set_user_premium', {
        user_id: userId,
        premium_status: isPremium
      });
    
    if (error) {
      console.error('Error setting premium status:', error);
      throw error;
    }
  },

  /**
   * Set a user's admin status (admin only)
   */
  async setUserAdmin(userId: string, isAdmin: boolean): Promise<void> {
    const { error } = await supabase
      .rpc('set_user_admin', {
        user_id: userId,
        admin_status: isAdmin
      });
    
    if (error) {
      console.error('Error setting admin status:', error);
      throw error;
    }
  },

  /**
   * Get the current user's profile
   */
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    return this.getUserById(user.id);
  }
}; 