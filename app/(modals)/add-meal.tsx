import { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, TextInput, Text, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/services/supabase/client';
import * as ImagePicker from 'expo-image-picker';
import { mediaService } from '@/services/api/media';

export default function AddMealModal() {
  const router = useRouter();
  const { dietPlanId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  // Nutritional info
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // Ingredients
  const [ingredients, setIngredients] = useState<Array<{
    name: string;
    amount: string;
    unit: string;
  }>>([{ name: '', amount: '', unit: '' }]);

  // Preparation steps
  const [steps, setSteps] = useState<string[]>(['']);

  const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [16, 9],
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUrl(result.assets[0].uri);
        }
  };

  const handleVideoPick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['videos'],
          allowsEditing: true,
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setVideoUrl(result.assets[0].uri);
        }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof typeof ingredients[0], value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      setError('Please fill in name and description');
      return;
    }

    if (!calories || !protein || !carbs || !fat) {
      setError('Please fill in all nutritional information');
      return;
    }

    if (ingredients.some(i => !i.name || !i.amount || !i.unit)) {
      setError('Please fill in all ingredient information');
      return;
    }

    if (steps.some(s => !s)) {
      setError('Please fill in all preparation steps');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('meals')
        .insert({
          diet_plan_id: dietPlanId,
          name,
          description,
          image_url: imageUrl || null,
          video_url: videoUrl || null,
          nutritional_info: {
            calories: parseInt(calories) || 0,
            protein: parseInt(protein) || 0,
            carbs: parseInt(carbs) || 0,
            fat: parseInt(fat) || 0,
          },
          ingredients: ingredients.map(i => ({
            ...i,
            amount: parseInt(i.amount) || 0,
          })),
          preparation_steps: steps,
        });

      if (insertError) {
        console.error('Insert Error:', insertError);
        throw insertError;
      }

      router.back();
    } catch (err) {
      console.error('Submission Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="titleLarge" style={styles.title}>
          Add New Meal
        </Text>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <View style={styles.mediaButtons}>
          <Button
            mode="outlined"
            onPress={handleImagePick}
            style={[styles.input, styles.mediaButton]}
            icon="image"
          >
            {imageUrl ? 'Change Image' : 'Add Image'}
          </Button>

          <Button
            mode="outlined"
            onPress={handleVideoPick}
            style={[styles.input, styles.mediaButton]}
            icon="video"
          >
            {videoUrl ? 'Change Video' : 'Add Video'}
          </Button>
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Nutritional Information
        </Text>

        <View style={styles.nutritionGrid}>
          <TextInput
            label="Calories"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
            style={[styles.input, styles.halfWidth]}
          />
          <TextInput
            label="Protein (g)"
            value={protein}
            onChangeText={setProtein}
            keyboardType="numeric"
            style={[styles.input, styles.halfWidth]}
          />
          <TextInput
            label="Carbs (g)"
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
            style={[styles.input, styles.halfWidth]}
          />
          <TextInput
            label="Fat (g)"
            value={fat}
            onChangeText={setFat}
            keyboardType="numeric"
            style={[styles.input, styles.halfWidth]}
          />
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Ingredients
        </Text>

        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientRow}>
            <TextInput
              label="Name"
              value={ingredient.name}
              onChangeText={(value) => updateIngredient(index, 'name', value)}
              style={[styles.input, styles.flex2]}
            />
            <TextInput
              label="Amount"
              value={ingredient.amount}
              onChangeText={(value) => updateIngredient(index, 'amount', value)}
              keyboardType="numeric"
              style={[styles.input, styles.flex1]}
            />
            <TextInput
              label="Unit"
              value={ingredient.unit}
              onChangeText={(value) => updateIngredient(index, 'unit', value)}
              style={[styles.input, styles.flex1]}
            />
            <IconButton
              icon="delete"
              onPress={() => removeIngredient(index)}
              disabled={ingredients.length === 1}
            />
          </View>
        ))}

        <Button
          mode="outlined"
          onPress={addIngredient}
          style={styles.input}
          icon="plus"
        >
          Add Ingredient
        </Button>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Preparation Steps
        </Text>

        {steps.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <Text style={styles.stepNumber}>{index + 1}.</Text>
            <TextInput
              value={step}
              onChangeText={(value) => updateStep(index, value)}
              style={[styles.input, styles.flex1]}
              multiline
            />
            <IconButton
              icon="delete"
              onPress={() => removeStep(index)}
              disabled={steps.length === 1}
            />
          </View>
        ))}

        <Button
          mode="outlined"
          onPress={addStep}
          style={styles.input}
          icon="plus"
        >
          Add Step
        </Button>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <View style={styles.actions}>
          <Button onPress={() => router.back()} style={styles.actionButton}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.actionButton}
          >
            Create
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    marginRight: 8,
    marginTop: 8,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  mediaButton: {
    flex: 1,
  },
}); 