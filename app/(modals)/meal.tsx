import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { dietService } from '@services/api/diet';
import { Meal } from '@/types/diet';

export default function MealModal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMeal();
  }, [id]);

  const loadMeal = async () => {
    try {
      const data = await dietService.getMeal(id as string);
      setMeal(data);
    } catch (err) {
      setError('Failed to load meal');
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

  if (error || !meal) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge" style={styles.error}>
          {error || 'Meal not found'}
        </Text>
        <Button mode="contained" onPress={() => router.back()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: meal.image_url }} style={styles.image} />
      
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {meal.name}
        </Text>
        
        <Text variant="bodyLarge" style={styles.description}>
          {meal.description}
        </Text>

        <View style={styles.nutritionInfo}>
          <NutritionItem label="Calories" value={meal.nutritional_info.calories} unit="kcal" />
          <NutritionItem label="Protein" value={meal.nutritional_info.protein} unit="g" />
          <NutritionItem label="Carbs" value={meal.nutritional_info.carbs} unit="g" />
          <NutritionItem label="Fat" value={meal.nutritional_info.fat} unit="g" />
        </View>

        <Text variant="titleLarge" style={styles.sectionTitle}>
          Ingredients
        </Text>
        {meal.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>
            • {ingredient.amount} {ingredient.unit} {ingredient.name}
          </Text>
        ))}

        <Text variant="titleLarge" style={[styles.sectionTitle, styles.topSpacing]}>
          Preparation Steps
        </Text>
        {meal.preparation_steps.map((step, index) => (
          <View key={index} style={styles.step}>
            <Text variant="titleMedium" style={styles.stepNumber}>
              {index + 1}
            </Text>
            <Text variant="bodyLarge" style={styles.stepText}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

interface NutritionItemProps {
  label: string;
  value: number;
  unit: string;
}

function NutritionItem({ label, value, unit }: NutritionItemProps) {
  return (
    <View style={styles.nutritionItem}>
      <Text variant="labelMedium" style={styles.nutritionLabel}>
        {label}
      </Text>
      <Text variant="bodyLarge">
        {value}{unit}
      </Text>
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
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    opacity: 0.7,
    marginBottom: 4,
    color: '#FFFFFF',
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#FFFFFF',
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  topSpacing: {
    marginTop: 24,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    backgroundColor: '#32CD32',
    color: '#000000',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    color: '#FFFFFF',
  },
  error: {
    color: '#FF453A',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 