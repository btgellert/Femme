import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, Avatar, List, Divider } from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { AddTrainingPlanButton } from '@/components/admin/AddTrainingPlanButton';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const isAdmin = user?.user_metadata?.role === 'admin';

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome to Fitness App
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Log in to access premium content and track your progress
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/(auth)/login')}
            style={styles.loginButton}
          >
            Log In
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push('/(auth)/register')}
            style={styles.registerButton}
          >
            Create Account
          </Button>
        </View>
      </View>
    );
  }

  // Get subscription status from user metadata
  const isPremium = user.user_metadata?.is_premium || false;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user.email?.substring(0, 2).toUpperCase() || 'U'} 
          style={styles.avatar}
        />
        <Text variant="headlineSmall" style={styles.name}>
          {user.email}
        </Text>
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>

      <List.Section>
        <List.Item
          title="Subscription"
          description={isPremium ? 'Premium' : 'Free'}
          left={props => <List.Icon {...props} icon="star" color="#32CD32" />}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
        />
        <List.Item
          title="Settings"
          left={props => <List.Icon {...props} icon="cog" color="#32CD32" />}
          titleStyle={styles.listTitle}
        />
        <List.Item
          title="Help & Support"
          left={props => <List.Icon {...props} icon="help-circle" color="#32CD32" />}
          titleStyle={styles.listTitle}
        />
      </List.Section>

      {isAdmin && (
        <>
          <Divider style={styles.divider} />
          
          <List.Section>
            <List.Subheader style={styles.sectionTitle}>Admin Tools</List.Subheader>
            
            <List.Item
              title="Manage Users"
              left={props => <List.Icon {...props} icon="account-group" color="#FFD700" />}
              onPress={() => router.push('/admin-users')}
              titleStyle={styles.listTitle}
            />
            
            <AddTrainingPlanButton />
          </List.Section>
        </>
      )}

      <Button 
        mode="outlined" 
        onPress={logout}
        style={styles.logoutButton}
        textColor="#32CD32"
      >
        Log Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    marginBottom: 12,
  },
  registerButton: {
    width: '100%',
    borderColor: '#32CD32',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#32CD32',
  },
  name: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  adminBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  adminBadgeText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  listTitle: {
    color: '#FFFFFF',
  },
  listDescription: {
    color: '#32CD32',
  },
  divider: {
    backgroundColor: '#2A2A2A',
    marginVertical: 16,
  },
  sectionTitle: {
    color: '#FFD700',
  },
  logoutButton: {
    marginTop: 24,
    borderColor: '#32CD32',
  },
}); 