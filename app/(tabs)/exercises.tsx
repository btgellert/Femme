import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { WorkoutPlanCard } from '@/components/exercise/WorkoutPlanCard';
import { AddWorkoutPlanButton } from '@/components/admin/AddWorkoutPlanButton';
import { exerciseService } from '@/services/api/exercise';
import { WorkoutPlan } from '@/types/exercise';
import { useAuth } from '@/hooks/useAuth';

export default function ExercisesScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [error, setError] = useState('');

  const isAdmin = user?.user_metadata?.role === 'admin';

  const loadWorkoutPlans = async () => {
    try {
      const plans = await exerciseService.getWorkoutPlans();
      // Sort by created_at date, newest first
      const sortedPlans = plans.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setWorkoutPlans(sortedPlans);
      setError('');
    } catch (err) {
      setError('Failed to load workout plans');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWorkoutPlans();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadWorkoutPlans();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge" style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAdmin && (
        <AddWorkoutPlanButton />
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {workoutPlans.length === 0 ? (
          <Text variant="bodyLarge" style={styles.emptyText}>
            No workout plans available
          </Text>
        ) : (
          workoutPlans.map(plan => (
            <WorkoutPlanCard 
              key={plan.id} 
              plan={plan}
            />
          ))
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 16,
    backgroundColor: '#000000',
  },
  error: {
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    color: '#FFFFFF',
  },
}); 