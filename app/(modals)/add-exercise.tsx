import { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, TextInput, Text, IconButton, SegmentedButtons } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/services/supabase/client';
import * as ImagePicker from 'expo-image-picker';
import { mediaService } from '@/services/api/media';

export default function AddExerciseModal() {
  const router = useRouter();
  const { workoutPlanId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  // Exercise details
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [duration, setDuration] = useState('');
  const [rest, setRest] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');

  // Lists
  const [muscleGroups, setMuscleGroups] = useState<string[]>(['']);
  const [equipment, setEquipment] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);

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

  // Muscle Groups
  const addMuscleGroup = () => {
    setMuscleGroups([...muscleGroups, '']);
  };

  const removeMuscleGroup = (index: number) => {
    setMuscleGroups(muscleGroups.filter((_, i) => i !== index));
  };

  const updateMuscleGroup = (index: number, value: string) => {
    const newGroups = [...muscleGroups];
    newGroups[index] = value;
    setMuscleGroups(newGroups);
  };

  // Equipment
  const addEquipment = () => {
    setEquipment([...equipment, '']);
  };

  const removeEquipment = (index: number) => {
    setEquipment(equipment.filter((_, i) => i !== index));
  };

  const updateEquipment = (index: number, value: string) => {
    const newEquipment = [...equipment];
    newEquipment[index] = value;
    setEquipment(newEquipment);
  };

  // Instructions
  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      setError('Please fill in name and description');
      return;
    }

    if (muscleGroups.some(group => !group)) {
      setError('Please fill in all muscle groups');
      return;
    }

    if (equipment.some(item => !item)) {
      setError('Please fill in all equipment');
      return;
    }

    if (instructions.some(instruction => !instruction)) {
      setError('Please fill in all instructions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('exercises')
        .insert({
          workout_plan_id: workoutPlanId,
          name,
          description,
          image_url: imageUrl || null,
          video_url: videoUrl || null,
          sets: parseInt(sets) || null,
          reps: parseInt(reps) || null,
          duration_seconds: parseInt(duration) || null,
          rest_seconds: parseInt(rest) || null,
          difficulty,
          muscle_groups: muscleGroups.filter(Boolean),
          equipment_needed: equipment.filter(Boolean),
          instructions: instructions.filter(Boolean),
        });

      if (insertError) {
        console.error('Insert Error:', insertError);
        throw insertError;
      }

      router.back();
    } catch (err) {
      console.error('Submission Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create exercise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="titleLarge" style={styles.title}>
          Add New Exercise
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
          Exercise Details
        </Text>

        <View style={styles.detailsGrid}>
          <TextInput
            label="Sets"
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
            style={[styles.input, styles.halfWidth]}
          />
          <TextInput
            label="Reps"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
            style={[styles.input, styles.halfWidth]}
          />
          <TextInput
            label="Duration (seconds)"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            style={[styles.input, styles.halfWidth]}
          />
          <TextInput
            label="Rest (seconds)"
            value={rest}
            onChangeText={setRest}
            keyboardType="numeric"
            style={[styles.input, styles.halfWidth]}
          />
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Difficulty Level
        </Text>

        <SegmentedButtons
          value={difficulty}
          onValueChange={setDifficulty}
          buttons={[
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
          ]}
          style={styles.input}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Muscle Groups
        </Text>

        {muscleGroups.map((muscleGroup, index) => (
          <View key={index} style={styles.row}>
            <TextInput
              value={muscleGroup}
              onChangeText={(value) => updateMuscleGroup(index, value)}
              style={[styles.input, styles.flex1]}
              placeholder={`Muscle Group ${index + 1}`}
            />
            <IconButton
              icon="delete"
              onPress={() => removeMuscleGroup(index)}
              disabled={muscleGroups.length === 1}
            />
          </View>
        ))}

        <Button
          mode="outlined"
          onPress={addMuscleGroup}
          style={styles.input}
          icon="plus"
        >
          Add Muscle Group
        </Button>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Equipment Needed
        </Text>

        {equipment.map((item, index) => (
          <View key={index} style={styles.row}>
            <TextInput
              value={item}
              onChangeText={(value) => updateEquipment(index, value)}
              style={[styles.input, styles.flex1]}
              placeholder={`Equipment ${index + 1}`}
            />
            <IconButton
              icon="delete"
              onPress={() => removeEquipment(index)}
              disabled={equipment.length === 1}
            />
          </View>
        ))}

        <Button
          mode="outlined"
          onPress={addEquipment}
          style={styles.input}
          icon="plus"
        >
          Add Equipment
        </Button>

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Instructions
        </Text>

        {instructions.map((instruction, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.stepNumber}>{index + 1}.</Text>
            <TextInput
              value={instruction}
              onChangeText={(value) => updateInstruction(index, value)}
              style={[styles.input, styles.flex1]}
              multiline
            />
            <IconButton
              icon="delete"
              onPress={() => removeInstruction(index)}
              disabled={instructions.length === 1}
            />
          </View>
        ))}

        <Button
          mode="outlined"
          onPress={addInstruction}
          style={styles.input}
          icon="plus"
        >
          Add Instruction
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
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  row: {
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