import { StyleSheet, View, Image } from 'react-native';
import { Card, Text, List } from 'react-native-paper';
import { Meal } from '../../types/diet';

interface MealCardProps {
  meal: Meal;
  onPress?: () => void;
}

export function MealCard({ meal, onPress }: MealCardProps) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: meal.image_url }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <Card.Content style={styles.content}>
        <Text variant="titleLarge">{meal.name}</Text>
        <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>

          {meal.description}
        </Text>
        
        <View style={styles.nutritionInfo}>
          <NutritionItem 
            label="Calories" 
            value={meal.nutritional_info.calories} 
            unit="kcal" 
          />
          <NutritionItem 
            label="Protein" 
            value={meal.nutritional_info.protein} 
            unit="g" 
          />
          <NutritionItem 
            label="Carbs" 
            value={meal.nutritional_info.carbs} 
            unit="g" 
          />
          <NutritionItem 
            label="Fat" 
            value={meal.nutritional_info.fat} 
            unit="g" 
          />
        </View>
      </Card.Content>
    </Card>
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
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
  },
  content: {
    paddingVertical: 8,
  },
  description: {
    marginTop: 4,
    opacity: 0.7,
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#1A1A1A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
}); 


const stylesImage = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
  },
  imageContainer: {
    height: 200,
    width: '100%',
    backgroundColor: '#1A1A1A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  description: {
    opacity: 0.7,
    color: '#FFFFFF',
  },
}); 