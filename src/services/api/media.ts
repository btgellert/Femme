import { supabase } from '../supabase/client';
import * as FileSystem from 'expo-file-system';

export interface MediaUploadResult {
  path: string;
  url: string;
}

export const mediaService = {
  async uploadFile(uri: string, path: string): Promise<MediaUploadResult> {
    try {
      // Read the file as base64
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      // Convert to blob
      const fileBlob = await fetch(uri).then(r => r.blob());

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('media')
        .upload(path, fileBlob, {
          upsert: true,
          contentType: fileBlob.type
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(path);

      return {
        path: data.path,
        url: publicUrl
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async deleteFile(path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('media')
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};
  