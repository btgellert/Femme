import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Portal, Modal, Button, TextInput, Text, Divider, List, ActivityIndicator } from 'react-native-paper';
import { trainingService } from '@/services/api/training';
import { supabase } from '@/services/supabase/client';

interface User {
  id: string;
  email: string;
  isPremium: boolean;
}

export function AddTrainingPlanButton() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))); // 30 days later
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Format date as YYYY-MM-DD for input
  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Validate date string in format YYYY-MM-DD
  function isValidDateString(dateStr: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  }

  useEffect(() => {
    if (visible) {
      loadPremiumUsers();
    }
  }, [visible]);

  const loadPremiumUsers = async () => {
    try {
      setLoadingUsers(true);
      
      // Instead of using the admin API directly, use a function to get users
      // This should be a query to a table that stores user metadata
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, is_premium')
        .eq('is_premium', true);
      
      if (error) throw error;
      
      const premiumUsers = data.map(user => ({
        id: user.id,
        email: user.email || 'No email',
        isPremium: user.is_premium
      }));
      
      setUsers(premiumUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users. Make sure user_profiles table exists.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setTitle('');
    setDescription('');
    setStartDate(formatDate(new Date()));
    setEndDate(formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)));
    setError('');
    setSelectedUserId(null);
  };

  const handleSubmit = async () => {
    if (!title || !description || !selectedUserId) {
      setError('Please fill all fields and select a user');
      return;
    }

    if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
      setError('Please enter valid dates in YYYY-MM-DD format');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await trainingService.createPersonalTrainingPlan(selectedUserId, {
        title,
        description,
        start_date: startDate,
        end_date: endDate
      });

      hideModal();
    } catch (err) {
      console.error(err);
      setError('Failed to create training plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        icon="plus"
        mode="contained"
        onPress={showModal}
        style={styles.button}
      >
        Add Training Plan
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Add Personal Training Plan
            </Text>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Select User
            </Text>

            {loadingUsers ? (
              <ActivityIndicator style={styles.activityIndicator} />
            ) : users.length === 0 ? (
              <Text style={styles.noUsersText}>
                No premium users found. Add premium users first.
              </Text>
            ) : (
              <View style={styles.usersList}>
                {users.map(user => (
                  <List.Item
                    key={user.id}
                    title={user.email}
                    description="Premium User"
                    onPress={() => setSelectedUserId(user.id)}
                    left={props => <List.Icon {...props} icon="account-star" color="#32CD32" />}
                    right={props => 
                      selectedUserId === user.id && 
                      <List.Icon {...props} icon="check" color="#32CD32" />
                    }
                    style={[
                      styles.userItem,
                      selectedUserId === user.id && styles.selectedUserItem
                    ]}
                    titleStyle={styles.userItemTitle}
                    descriptionStyle={styles.userItemDescription}
                  />
                ))}
              </View>
            )}

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Plan Details
            </Text>

            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />

            <TextInput
              label="Start Date (YYYY-MM-DD)"
              value={startDate}
              onChangeText={setStartDate}
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
            />

            <TextInput
              label="End Date (YYYY-MM-DD)"
              value={endDate}
              onChangeText={setEndDate}
              style={styles.input}
              mode="outlined"
              placeholder="YYYY-MM-DD"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.buttonsContainer}>
              <Button
                mode="outlined"
                onPress={hideModal}
                style={styles.cancelButton}
                textColor="#FFFFFF"
              >
                Cancel
              </Button>

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                loading={loading}
                disabled={loading}
              >
                Create Plan
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 'auto',
  },
  modalContainer: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    borderRadius: 8,
  },
  modalTitle: {
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    backgroundColor: '#2A2A2A',
    marginVertical: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
  },
  errorText: {
    color: '#FF453A',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#2A2A2A',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
  usersList: {
    marginBottom: 16,
  },
  userItem: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedUserItem: {
    backgroundColor: '#1E3D29',
    borderColor: '#32CD32',
    borderWidth: 1,
  },
  userItemTitle: {
    color: '#FFFFFF',
  },
  userItemDescription: {
    color: '#32CD32',
  },
  noUsersText: {
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    marginVertical: 16,
  },
  activityIndicator: {
    marginVertical: 16,
  },
}); 