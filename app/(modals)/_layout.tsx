import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack
    screenOptions={{
      headerStyle: { backgroundColor: 'black' }, // Black header background
      headerTintColor: 'white', // White text
    }}>
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