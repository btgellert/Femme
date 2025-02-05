import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="diet-plan"
        options={{
          title: 'Diet Plan',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="meal"
        options={{
          title: 'Meal Details',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="add-meal"
        options={{
          title: 'Add New Meal',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="add-exercise"
        options={{
          title: 'Add New Exercise',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
} 