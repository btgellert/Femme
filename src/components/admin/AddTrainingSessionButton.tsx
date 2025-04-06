import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, Button, TextInput, Text, Divider } from 'react-native-paper';
import { trainingService } from '@/services/api/training';
import * as ImagePicker from 'expo-image-picker';
import { mediaService } from '@/services/api/media';

interface AddTrainingSessionButtonProps {
  planId: string;
  onSessionAdded: () => void;
}

export function AddTrainingSessionButton({ planId, onSessionAdded }: AddTrainingSessionButtonProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dayNumber, setDayNumber] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setTitle('');
    setDescription('');
    setDayNumber('');
    setDurationMinutes('');
    setNotes('');
    setVideoUrl('');
    setError('');
  };

  const handleVideoPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      try {
        // Upload video to storage
        const videoUploadPath = `training_videos/${planId}/${Date.now()}.mp4`;
        const { url } = await mediaService.uploadFile(result.assets[0].uri, videoUploadPath);
        setVideoUrl(url);
      } catch (error) {
        console.error('Error uploading video:', error);
        setError('Failed to upload video');
      }
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !dayNumber || !durationMinutes) {
      setError('Please fill all required fields');
      return;
    }

    const dayNum = parseInt(dayNumber);
    const duration = parseInt(durationMinutes);

    if (isNaN(dayNum) || dayNum <= 0) {
      setError('Day number must be a positive number');
      return;
    }

    if (isNaN(duration) || duration <= 0) {
      setError('Duration must be a positive number');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await trainingService.createTrainingSession({
        plan_id: planId,
        title,
        description,
        day_number: dayNum,
        duration_minutes: duration,
        notes: notes || undefined,
        video_url: videoUrl || undefined
      });

      hideModal();
      onSessionAdded();
    } catch (err) {
      console.error(err);
      setError('Failed to create training session');
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
        Add Session
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Add Training Session
          </Text>

          <Divider style={styles.divider} />

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

          <View style={styles.row}>
            <TextInput
              label="Day Number"
              value={dayNumber}
              onChangeText={setDayNumber}
              style={[styles.input, styles.halfInput]}
              mode="outlined"
              keyboardType="number-pad"
            />

            <TextInput
              label="Duration (minutes)"
              value={durationMinutes}
              onChangeText={setDurationMinutes}
              style={[styles.input, styles.halfInput]}
              mode="outlined"
              keyboardType="number-pad"
            />
          </View>

          <TextInput
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={2}
          />

          <Button
            mode="outlined"
            icon="video-plus"
            onPress={handleVideoPick}
            style={styles.videoButton}
          >
            {videoUrl ? 'Change Video' : 'Add Video (optional)'}
          </Button>

          {videoUrl ? (
            <Text style={styles.videoUploaded}>Video uploaded</Text>
          ) : null}

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
              Create Session
            </Button>
          </View>
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
  input: {
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  videoButton: {
    marginBottom: 16,
    borderColor: '#2A2A2A',
  },
  videoUploaded: {
    color: '#32CD32',
    marginBottom: 16,
  },
  errorText: {
    color: '#FF453A',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
}); 