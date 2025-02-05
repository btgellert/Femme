import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, Button, TextInput, Switch, Text } from 'react-native-paper';
import { dietService } from '@/services/api/diet';
import * as ImagePicker from 'expo-image-picker';
import { mediaService } from '@/services/api/media';

export function AddDietPlanButton() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setTitle('');
    setDescription('');
    setIsPremium(false);
    setThumbnailUrl('');
    setVideoUrl('');
    setError('');
  };

  const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [16, 9],
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setThumbnailUrl(result.assets[0].uri);
        } 
  };

  const handleVideoPick = async () => {
    // Only proceed with video picker if we have permission
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setThumbnailUrl(result.assets[0].uri);
    }
  };


  const handleSubmit = async () => {
    if (!title || !description || !thumbnailUrl) {
      setError('Please fill in all required fields and add a thumbnail');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await dietService.createDietPlan({
        title,
        description,
        is_premium: isPremium,
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl || null,
      });
      hideModal();
    } catch (err) {
      setError('Failed to create diet plan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        mode="contained" 
        onPress={showModal}
        style={styles.addButton}
        icon="plus"
      >
        Add Diet Plan
      </Button>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.title}>
            Add New Diet Plan
          </Text>

          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
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
              icon={thumbnailUrl ? "check" : "image"}
            >
              {thumbnailUrl ? 'Thumbnail Selected' : 'Add Thumbnail'}
            </Button>

            <Button
              mode="outlined"
              onPress={handleVideoPick}
              style={[styles.input, styles.mediaButton]}
              icon={videoUrl ? "check" : "video"}
            >
              {videoUrl ? 'Video Selected' : 'Add Video'}
            </Button>
          </View>

          <View style={styles.switchContainer}>
            <Text>Premium Content</Text>
            <Switch value={isPremium} onValueChange={setIsPremium} />
          </View>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          <View style={styles.actions}>
            <Button onPress={hideModal} style={styles.actionButton}>
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
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    margin: 16,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 10,
  },
}); 