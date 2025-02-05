import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MealCard } from '@components/diet/MealCard';
import { AddMealButton } from '@components/admin/AddMealButton';
import { dietService } from '@services/api/diet';
import { DietPlanWithMeals } from '@/types/diet';
import { useAuth } from '@hooks/useAuth';

export default function DietPlanModal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [plan, setPlan] = useState<DietPlanWithMeals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    loadDietPlan();
  }, [id]);

  const loadDietPlan = async () => {
    try {
      const data = await dietService.getDietPlanWithMeals(id as string);
      setPlan(data);
    } catch (err) {
      setError('Failed to load diet plan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !plan) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge" style={styles.error}>
          {error || 'Diet plan not found'}
        </Text>
        <Button mode="contained" onPress={() => router.back()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  const isPremiumLocked = plan.is_premium && !user?.user_metadata?.is_premium && !isAdmin;

  return (
    <ScrollView style={[styles.container, { zIndex: 1 }]}>
      <Image source={{ uri: plan.thumbnail_url }} style={styles.image} />
      
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {plan.title}
        </Text>
        
        <Text variant="bodyLarge" style={styles.description}>
          {plan.description}
        </Text>

        {isPremiumLocked ? (
          <View style={styles.premiumLock}>
            <Text variant="titleMedium" style={styles.premiumText}>
              This is a premium diet plan
            </Text>
            <Text variant="bodyMedium" style={styles.premiumSubtext}>
              Upgrade your account to access this content
            </Text>
            <Button 
              mode="contained" 
              onPress={() => {
                router.back();
                router.push('/(tabs)/profile');
              }}
              style={styles.upgradeButton}
            >
              Upgrade to Premium
            </Button>
          </View>
        ) : (
          <>
            <View style={styles.mealsHeader}>
              <Text variant="titleLarge">Meals</Text>
              {isAdmin && (
                <AddMealButton 
                  dietPlanId={plan.id} 
                  onMealAdded={loadDietPlan}
                />
              )}
            </View>
            {plan.meals.map(meal => (
              <MealCard 
                key={meal.id} 
                meal={meal}
                onPress={() => router.push({
                  pathname: '/(modals)/meal',
                  params: { id: meal.id }
                })}
              />
            ))}
          </>
        )}
      </View>
    </ScrollView>
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
  content: {
    padding: 16,
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    marginBottom: 8,
    color: '#FFFFFF',
  },
  description: {
    opacity: 0.7,
    marginBottom: 24,
    color: '#FFFFFF',
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  error: {
    color: '#FF453A',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  premiumLock: {
    backgroundColor: '#1A1A1A',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  premiumText: {
    color: '#32CD32',
    marginBottom: 8,
  },
  premiumSubtext: {
    color: '#32CD32',
    opacity: 0.7,
    marginBottom: 16,
    textAlign: 'center',
  },
  upgradeButton: {
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    color: '#FFFFFF',
  },
  exerciseCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  exerciseImage: {
    width: '100%',
    height: 150,
  },
  exerciseContent: {
    padding: 16,
  },
  exerciseDescription: {
    marginTop: 4,
    opacity: 0.7,
    color: '#FFFFFF',
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
    color: '#FFFFFF',
  },
  difficulty: {
    marginTop: 8,
    textTransform: 'capitalize',
    opacity: 0.7,
    color: '#FFFFFF',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: '#FFFFFF',
  },
  equipmentTag: {
    backgroundColor: '#1E1E1E',
  },
  instructions: {
    marginTop: 16,
  },
  instruction: {
    marginBottom: 4,
    color: '#FFFFFF',
  },
}); 