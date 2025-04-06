import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Checkbox, IconButton } from 'react-native-paper';
import { PersonalTrainingSession } from '@/types/training';
import { trainingService } from '@/services/api/training';

interface SessionCardProps {
  session: PersonalTrainingSession;
  onUpdate: () => void;
}

export function SessionCard({ session, onUpdate }: SessionCardProps) {
  const handleToggleComplete = async () => {
    try {
      await trainingService.updateSessionCompletion(session.id, !session.is_completed);
      onUpdate();
    } catch (error) {
      console.error('Failed to update session completion status', error);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  return (
    <Card style={[styles.card, session.is_completed && styles.completed]}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text variant="labelMedium" style={styles.day}>Day {session.day_number}</Text>
            <Text variant="titleMedium" style={styles.title}>{session.title}</Text>
          </View>
          <Checkbox
            status={session.is_completed ? 'checked' : 'unchecked'}
            onPress={handleToggleComplete}
            color="#32CD32"
          />
        </View>
        
        <Text variant="bodyMedium" style={styles.description}>
          {session.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.duration}>
            <IconButton
              icon="clock-outline"
              size={16}
              iconColor="#808080"
              style={styles.icon}
            />
            <Text variant="bodySmall" style={styles.durationText}>
              {formatDuration(session.duration_minutes)}
            </Text>
          </View>
          
          {session.video_url && (
            <IconButton
              icon="video-outline"
              size={20}
              iconColor="#32CD32"
              onPress={() => {/* TODO: Open video */}}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
  },
  completed: {
    opacity: 0.7,
    borderLeftColor: '#32CD32',
    borderLeftWidth: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  day: {
    color: '#32CD32',
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
  },
  description: {
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    margin: 0,
    marginRight: 4,
  },
  durationText: {
    color: '#808080',
  },
}); 