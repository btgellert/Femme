import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { trainingService } from '@/services/api/training';
import { PersonalTrainingPlanWithSessions } from '@/types/training';
import { TrainingPlanCard } from '@/components/training/TrainingPlanCard';
import { AddTrainingPlanButton } from '@/components/admin/AddTrainingPlanButton';

export default function TrainingScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trainingPlans, setTrainingPlans] = useState<PersonalTrainingPlanWithSessions[]>([]);
  const [error, setError] = useState('');

  const isPremium = user?.user_metadata?.is_premium || false;
  const isAdmin = user?.user_metadata?.role === 'admin';

  const loadTrainingPlans = async () => {
    try {
      setError('');
      // Get all training plans
      const plans = await trainingService.getPersonalTrainingPlans();
      
      // For each plan, get its sessions too
      const plansWithSessions = await Promise.all(
        plans.map(async (plan) => {
          return await trainingService.getPersonalTrainingPlanWithSessions(plan.id);
        })
      );
      
      setTrainingPlans(plansWithSessions);
    } catch (err) {
      console.error(err);
      setError('Failed to load training plans');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTrainingPlans();
    } else {
      setLoading(false);
    }
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTrainingPlans();
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text variant="headlineMedium" style={styles.title}>
            Personal Training
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Log in to access your personalized training plans
          </Text>
          <Button
            mode="contained"
            onPress={() => router.push('/(auth)/login')}
            style={styles.loginButton}
          >
            Log In
          </Button>
        </View>
      </View>
    );
  }

  if (!isPremium && !isAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text variant="headlineMedium" style={styles.title}>
            Premium Feature
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Personal training is available for premium members only.
            Upgrade your account to get access to personalized training plans.
          </Text>
          <Button
            mode="contained"
            style={styles.upgradeButton}
          >
            Upgrade to Premium
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerContainer}>
          <Text variant="headlineMedium" style={styles.title}>
            Personal Training
          </Text>
          
          {isAdmin && <AddTrainingPlanButton />}
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button mode="contained" onPress={loadTrainingPlans} style={styles.retryButton}>
              Retry
            </Button>
          </View>
        ) : trainingPlans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isAdmin 
                ? "No training plans available. Create one for a user!"
                : "You don't have any active training plans yet."}
            </Text>
          </View>
        ) : (
          <View>
            {trainingPlans.map(plan => (
              <TrainingPlanCard key={plan.id} plan={plan} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  loginButton: {
    width: '100%',
    marginTop: 16,
  },
  upgradeButton: {
    width: '100%',
    marginTop: 16,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  errorContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF453A',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
  },
}); 