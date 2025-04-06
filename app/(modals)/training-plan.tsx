import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Button, Divider, List } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { trainingService } from '@/services/api/training';
import { PersonalTrainingPlanWithSessions } from '@/types/training';
import { SessionCard } from '@/components/training/SessionCard';
import { AddTrainingSessionButton } from '@/components/admin/AddTrainingSessionButton';

export default function TrainingPlanModal() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [plan, setPlan] = useState<PersonalTrainingPlanWithSessions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.user_metadata?.role === 'admin';

  useEffect(() => {
    loadTrainingPlan();
  }, [id]);

  const loadTrainingPlan = async () => {
    try {
      const data = await trainingService.getPersonalTrainingPlanWithSessions(id as string);
      setPlan(data);
    } catch (err) {
      setError('Failed to load training plan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!plan) return 0;
    const completed = plan.sessions.filter(session => session.is_completed).length;
    return Math.round((completed / plan.sessions.length) * 100);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !plan) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge" style={styles.error}>
          {error || 'Training plan not found'}
        </Text>
        <Button mode="contained" onPress={() => router.back()} style={styles.button}>
          Go Back
        </Button>
      </View>
    );
  }

  // Format dates
  const startDate = new Date(plan.start_date).toLocaleDateString();
  const endDate = new Date(plan.end_date).toLocaleDateString();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {plan.title}
        </Text>
        
        <Text variant="bodyLarge" style={styles.description}>
          {plan.description}
        </Text>
        
        <View style={styles.infoContainer}>
          {/* Include user information for admins */}
          {isAdmin && (
            <List.Item
              title="Assigned To"
              description={`User ID: ${plan.user_id}`}
              left={props => <List.Icon {...props} icon="account" color="#32CD32" />}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              style={styles.listItem}
            />
          )}
          
          <List.Item
            title="Duration"
            description={`${startDate} - ${endDate}`}
            left={props => <List.Icon {...props} icon="calendar" color="#32CD32" />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            style={styles.listItem}
          />
          
          <List.Item
            title="Sessions"
            description={`${plan.sessions.length} total`}
            left={props => <List.Icon {...props} icon="fitness" color="#32CD32" />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            style={styles.listItem}
          />
          
          <List.Item
            title="Progress"
            description={`${calculateProgress()}% complete`}
            left={props => <List.Icon {...props} icon="chart-timeline-variant" color="#32CD32" />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            style={styles.listItem}
          />
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.sessionsContainer}>
        <View style={styles.sessionsHeader}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Training Sessions
          </Text>
          
          {isAdmin && (
            <AddTrainingSessionButton 
              planId={plan.id} 
              onSessionAdded={loadTrainingPlan} 
            />
          )}
        </View>
        
        {plan.sessions.length === 0 ? (
          <Text style={styles.emptyText}>
            {isAdmin 
              ? "No sessions available. Add sessions to this plan."
              : "No sessions available for this plan."}
          </Text>
        ) : (
          plan.sessions
            .sort((a, b) => a.day_number - b.day_number)
            .map(session => (
              <SessionCard 
                key={session.id} 
                session={session} 
                onUpdate={loadTrainingPlan}
              />
            ))
        )}
      </View>
      
      {isAdmin && (
        <View style={styles.adminActions}>
          <Button 
            mode="outlined" 
            icon="delete" 
            onPress={async () => {
              try {
                await trainingService.deleteTrainingPlan(plan.id);
                router.back();
              } catch (error) {
                console.error(error);
                setError('Failed to delete training plan');
              }
            }}
            style={styles.deleteButton}
            textColor="#FF453A"
          >
            Delete Plan
          </Button>
        </View>
      )}
    </ScrollView>
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
  header: {
    padding: 16,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    marginTop: 8,
  },
  listItem: {
    padding: 0,
  },
  listTitle: {
    color: '#FFFFFF',
  },
  listDescription: {
    color: '#32CD32',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginVertical: 16,
  },
  sessionsContainer: {
    padding: 16,
  },
  sessionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
  },
  emptyText: {
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 24,
  },
  error: {
    color: '#FF453A',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  adminActions: {
    padding: 16,
    marginTop: 16,
  },
  deleteButton: {
    borderColor: '#FF453A',
  },
}); 