import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

interface AddMealButtonProps {
  dietPlanId: string;
  onMealAdded?: () => void;
}

export function AddMealButton({ dietPlanId, onMealAdded }: AddMealButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(modals)/add-meal',
      params: { dietPlanId }
    });
  };

  return (
    <Button 
      mode="outlined" 
      onPress={handlePress}
      style={{ margin: 16 }}
      icon="plus"
    >
      Add Meal
    </Button>
  );
} 