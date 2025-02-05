import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { DietPlanCard } from '@components/diet/DietPlanCard';
import { AddDietPlanButton } from '@components/admin/AddDietPlanButton';
import { dietService } from '@services/api/diet';
import { DietPlan } from '@/types/diet';
import { useAuth } from '@hooks/useAuth';

export default function DietScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [error, setError] = useState('');

  const isAdmin = user?.user_metadata?.role === 'admin';

  const loadDietPlans = async () => {
    try {
      const plans = await dietService.getDietPlans();
      // Sort by created_at date, newest first
      const sortedPlans = plans.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setDietPlans(sortedPlans);
      setError('');
    } catch (err) {
      setError('Failed to load diet plans');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDietPlans();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDietPlans();
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
        <AddDietPlanButton />
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {dietPlans.length === 0 ? (
          <Text variant="bodyLarge" style={styles.emptyText}>
            No diet plans available
          </Text>
        ) : (
          dietPlans.map(plan => (
            <DietPlanCard key={plan.id} plan={plan} />
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