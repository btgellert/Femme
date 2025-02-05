import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AddExerciseButton } from '@/components/admin/AddExerciseButton';
import { exerciseService } from '@/services/api/exercise';
import { WorkoutPlanWithExercises } from '@/types/exercise';
import { useAuth } from '@/hooks/useAuth';

export default function WorkoutPlanModal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [plan, setPlan] = useState<WorkoutPlanWithExercises | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    loadWorkoutPlan();
  }, [id]);

  const loadWorkoutPlan = async () => {
    try {
      const data = await exerciseService.getWorkoutPlanWithExercises(id as string);
      setPlan(data);
    } catch (err) {
      setError('Failed to load workout plan');
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
          {error || 'Workout plan not found'}
        </Text>
        <Button mode="contained" onPress={() => router.back()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  const isPremiumLocked = plan.is_premium && !user?.user_metadata?.is_premium && !isAdmin;

  return (
    <ScrollView style={styles.container}>
      {plan.thumbnail_url && (
        <Image source={{ uri: plan.thumbnail_url }} style={styles.image} />
      )}
      
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
              This is a premium workout plan
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
            <View style={styles.exercisesHeader}>
              <Text variant="titleLarge">Exercises</Text>
              {isAdmin && (
                <AddExerciseButton 
                  workoutPlanId={plan.id} 
                  onExerciseAdded={loadWorkoutPlan}
                />
              )}
            </View>

            {plan.exercises.length === 0 ? (
              <Text variant="bodyLarge" style={styles.emptyText}>
                No exercises added yet
              </Text>
            ) : (
              plan.exercises.map(exercise => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  {exercise.image_url && (
                    <Image source={{ uri: exercise.image_url }} style={styles.exerciseImage} />
                  )}
                  <View style={styles.exerciseContent}>
                    <Text variant="titleMedium">{exercise.name}</Text>
                    <Text variant="bodyMedium" style={styles.exerciseDescription}>
                      {exercise.description}
                    </Text>
                    
                    <View style={styles.exerciseDetails}>
                      {exercise.sets && (
                        <Text variant="bodyMedium">Sets: {exercise.sets}</Text>
                      )}
                      {exercise.reps && (
                        <Text variant="bodyMedium">Reps: {exercise.reps}</Text>
                      )}
                      {exercise.duration_seconds && (
                        <Text variant="bodyMedium">Duration: {exercise.duration_seconds}s</Text>
                      )}
                      {exercise.rest_seconds && (
                        <Text variant="bodyMedium">Rest: {exercise.rest_seconds}s</Text>
                      )}
                    </View>

                    <Text variant="labelSmall" style={styles.difficulty}>
                      {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                    </Text>

                    {exercise.muscle_groups.length > 0 && (
                      <View style={styles.tagContainer}>
                        {exercise.muscle_groups.map((group, index) => (
                          <Text key={index} style={styles.tag}>
                            {group}
                          </Text>
                        ))}
                      </View>
                    )}

                    {exercise.equipment_needed.length > 0 && (
                      <View style={styles.tagContainer}>
                        {exercise.equipment_needed.map((item, index) => (
                          <Text key={index} style={[styles.tag, styles.equipmentTag]}>
                            {item}
                          </Text>
                        ))}
                      </View>
                    )}

                    <View style={styles.instructions}>
                      {exercise.instructions.map((instruction, index) => (
                        <Text key={index} style={styles.instruction}>
                          {index + 1}. {instruction}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              ))
            )}
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
  exercisesHeader: {
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