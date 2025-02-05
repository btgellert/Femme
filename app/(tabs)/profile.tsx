import { StyleSheet, View } from 'react-native';
import { Text, Button, Avatar, List } from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
  const isPremium = user.user_metadata?.is_subscribed || false;

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
      </View>

      <List.Section>
        <List.Item
          title="Subscription"
          description={isPremium ? 'Premium' : 'Free'}
          left={props => <List.Icon {...props} icon="star" color="#32CD32" />}
          onPress={() => router.push('/(modals)/subscription')}
          titleStyle={styles.listTitle}
          descriptionStyle={styles.listDescription}
        />
        <List.Item
          title="Settings"
          left={props => <List.Icon {...props} icon="cog" color="#32CD32" />}
          onPress={() => router.push('/(modals)/settings')}
          titleStyle={styles.listTitle}
        />
        <List.Item
          title="Help & Support"
          left={props => <List.Icon {...props} icon="help-circle" color="#32CD32" />}
          onPress={() => router.push('/(modals)/support')}
          titleStyle={styles.listTitle}
        />
      </List.Section>

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
    padding: 16,
    backgroundColor: '#000000',
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatar: {
    backgroundColor: '#1A1A1A',
  },
  name: {
    marginTop: 8,
    color: '#FFFFFF',
  },
  logoutButton: {
    marginTop: 'auto',
    borderColor: '#32CD32',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
    color: '#FFFFFF',
  },
  loginButton: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#32CD32',
  },
  registerButton: {
    width: '100%',
    borderColor: '#32CD32',
  },
  listTitle: {
    color: '#FFFFFF',
  },
  listDescription: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
}); 