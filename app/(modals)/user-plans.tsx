import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Button, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { trainingService } from '@/services/api/training';
import { PersonalTrainingPlanWithSessions } from '@/types/training';
import { TrainingPlanCard } from '@/components/training/TrainingPlanCard';
import { AddTrainingSessionButton } from '@/components/admin/AddTrainingSessionButton';
import { AddTrainingPlanButton } from '@/components/admin/AddTrainingPlanButton';

export default function UserPlansModal() {
  const { userId, userEmail } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [plans, setPlans] = useState<PersonalTrainingPlanWithSessions[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    if (isAdmin && userId) {
      loadUserPlans();
    }
  }, [isAdmin, userId]);

  const loadUserPlans = async () => {
    try {
      setLoading(true);
      setError('');

      // Get all training plans for the specific user
      const allPlans = await trainingService.getPersonalTrainingPlans();
      const userPlans = allPlans.filter(plan => plan.user_id === userId);
      
      // For each plan, get its sessions
      const plansWithSessions = await Promise.all(
        userPlans.map(async (plan) => {
          return await trainingService.getPersonalTrainingPlanWithSessions(plan.id);
        })
      );
      
      setPlans(plansWithSessions);
    } catch (err) {
      console.error('Failed to load user plans:', err);
      setError('Failed to load user plans');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUserPlans();
  };

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
        <View>
          <Text variant="headlineMedium" style={styles.title}>
            User Plans
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {userEmail as string}
          </Text>
        </View>
        
        <AddTrainingPlanButton />
      </View>
      
      <Divider style={styles.divider} />
      
      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={loadUserPlans} style={styles.button}>
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
          {plans.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                This user has no training plans yet.
              </Text>
              <Button 
                mode="contained" 
                onPress={() => {
                  // Use the AddTrainingPlanButton to create a plan for this user
                  const { AddTrainingPlanButton } = require('@/components/admin/AddTrainingPlanButton');
                  const button = new AddTrainingPlanButton({});
                  button.showModal?.();
                }}
                style={styles.createButton}
              >
                Create Plan
              </Button>
            </View>
          ) : (
            <View>
              {plans.map(plan => (
                <TrainingPlanCard key={plan.id} plan={plan} />
              ))}
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#32CD32',
    marginTop: 4,
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
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: '#FF453A',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  createButton: {
    marginTop: 16,
  },
}); 