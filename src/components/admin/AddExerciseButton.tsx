import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface AddExerciseButtonProps {
  workoutPlanId: string;
  onExerciseAdded?: () => void;
}

export function AddExerciseButton({ workoutPlanId, onExerciseAdded }: AddExerciseButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(modals)/add-exercise',
      params: { workoutPlanId }
    });
  };

  return (
    <Button 
      mode="outlined" 
      onPress={handlePress}
      style={{ margin: 16 }}
      icon="plus"
    >
      Add Exercise
    </Button>
  );
} 