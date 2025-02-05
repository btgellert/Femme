import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { WorkoutPlan } from '@/types/exercise';

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
}

export function WorkoutPlanCard({ plan }: WorkoutPlanCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(modals)/workout-plan',
      params: { id: plan.id }
    });
  };

  return (
    <Card
      style={styles.card}
      onPress={handlePress}
    >
      {plan.thumbnail_url && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: plan.thumbnail_url }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}
      <Card.Content style={styles.content}>
        <Text variant="titleLarge" style={styles.title}>{plan.title}</Text>
        <Text variant="bodyMedium" style={styles.description}>
          {plan.description}
        </Text>
        {plan.is_premium && (
          <Text variant="labelSmall" style={styles.premiumBadge}>
            Premium
          </Text>
        )}
      </Card.Content>
    </Card>
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
    paddingVertical: 16,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    marginTop: 8,
    opacity: 0.7,
    color: '#FFFFFF',
  },
  premiumBadge: {
    marginTop: 8,
    color: '#32CD32',
    fontWeight: 'bold',
  },
}); 