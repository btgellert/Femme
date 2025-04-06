import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Button, List, Switch, Divider, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { userService, UserProfile } from '@/services/api/users';

export default function AdminUsersModal() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const usersList = await userService.getAllUsers();
      setUsers(usersList);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users. Make sure user_profiles table exists.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const toggleUserPremium = async (userId: string, currentStatus: boolean) => {
    try {
      setUpdating(userId);
      
      await userService.setUserPremium(userId, !currentStatus);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_premium: !currentStatus } 
          : user
      ));
    } catch (err) {
      console.error('Failed to update user premium status:', err);
      setError('Failed to update user premium status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = searchQuery
    ? users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  if (!isAdmin) {
    return (
      <View style={styles.centered}>
        <Text variant="headlineMedium" style={styles.title}>
          Unauthorized Access
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          You do not have permission to access this page.
        </Text>
        <Button mode="contained" onPress={() => router.back()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Manage Users
        </Text>
        
        <Searchbar
          placeholder="Search by email"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#FFFFFF"
          inputStyle={{ color: '#FFFFFF' }}
        />
      </View>
      
      <Divider style={styles.divider} />
      
      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={loadUsers} style={styles.button}>
            Retry
          </Button>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredUsers.length === 0 ? (
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users match your search' : 'No users found'}
            </Text>
          ) : (
            filteredUsers.map(user => (
              <List.Item
                key={user.id}
                title={user.email}
                description={`ID: ${user.id.substring(0, 8)}...`}
                left={props => 
                  <List.Icon 
                    {...props} 
                    icon={
                      user.is_admin
                        ? 'account-key' 
                        : user.is_premium 
                          ? 'account-star' 
                          : 'account'
                    } 
                    color={
                      user.is_admin
                        ? '#FFD700' 
                        : user.is_premium
                          ? '#32CD32' 
                          : '#FFFFFF'
                    }
                  />
                }
                right={props => (
                  <View style={styles.rightAction}>
                    <Text style={[
                      styles.statusText,
                      { color: user.is_premium ? '#32CD32' : '#808080' }
                    ]}>
                      {user.is_premium ? 'Premium' : 'Free'}
                    </Text>
                    {updating === user.id ? (
                      <ActivityIndicator size={20} />
                    ) : (
                      <Switch
                        value={user.is_premium}
                        onValueChange={() => toggleUserPremium(user.id, user.is_premium)}
                        disabled={user.is_admin}
                        color="#32CD32"
                      />
                    )}
                  </View>
                )}
                style={styles.userItem}
                titleStyle={styles.userItemTitle}
                descriptionStyle={styles.userItemDescription}
                onPress={() => {
                  // Navigate to user plans
                  router.push({
                    pathname: '/(modals)/user-plans',
                    params: { userId: user.id, userEmail: user.email }
                  });
                }}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    padding: 16,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  searchBar: {
    backgroundColor: '#1A1A1A',
    marginBottom: 8,
  },
  divider: {
    backgroundColor: '#2A2A2A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  userItem: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginBottom: 8,
  },
  userItemTitle: {
    color: '#FFFFFF',
  },
  userItemDescription: {
    color: '#808080',
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginRight: 8,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: '#FF453A',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    padding: 24,
  },
}); 