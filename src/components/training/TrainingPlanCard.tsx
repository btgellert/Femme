import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { PersonalTrainingPlanWithSessions } from '@/types/training';

interface TrainingPlanCardProps {
  plan: PersonalTrainingPlanWithSessions;
}

export function TrainingPlanCard({ plan }: TrainingPlanCardProps) {
  const router = useRouter();
  
  // Calculate progress percentage
  const completedSessions = plan.sessions.filter(session => session.is_completed).length;
  const totalSessions = plan.sessions.length;
  const progress = totalSessions > 0 ? completedSessions / totalSessions : 0;
  
  // Format dates
  const startDate = new Date(plan.start_date).toLocaleDateString();
  const endDate = new Date(plan.end_date).toLocaleDateString();

  const handlePress = () => {
    router.push({
      pathname: '/(modals)/training-plan',
      params: { id: plan.id }
    });
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content style={styles.content}>
        <Text variant="titleLarge" style={styles.title}>{plan.title}</Text>
        <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
          {plan.description}
        </Text>
        
        <View style={styles.dates}>
          <Text variant="bodySmall" style={styles.dateText}>
            {startDate} - {endDate}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text variant="bodySmall" style={styles.progressText}>
              Progress: {completedSessions}/{totalSessions} sessions
            </Text>
            <Text variant="bodySmall" style={styles.progressPercentage}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <ProgressBar progress={progress} style={styles.progressBar} color="#32CD32" />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 12,
  },
  dates: {
    marginBottom: 12,
  },
  dateText: {
    color: '#32CD32',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
  progressPercentage: {
    color: '#32CD32',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
}); 