import { supabase } from '../supabase/client';
import { MediaUploadData, MediaUploadResult } from '@/types/media';

export const mediaService = {
    async uploadFile({ uri, fileType, folder }: MediaUploadData): Promise<MediaUploadResult> {
      try {
        // Validate inputs
        if (!uri || !fileType || !folder) {
            console.error('Missing required parameters');
          throw new Error('Missing required parameters');
        }
  
        // Validate URI format
        if (!/^https?:\/\//.test(uri)) {
            console.error(`Invalid file URI: ${uri}`);
          throw new Error('Invalid file URI');
        }
  
        // Fetch the file and handle potential network errors
        const response = await fetch(uri).catch(() => { 
            console.error('Network error while fetching file');
          throw new Error('Network error while fetching file'); 
        });
  

        if (!response.ok) {
            console.error(`Failed to fetch file: ${response.statusText}`);
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
  

        // Convert response to a Blob
        const blob = await response.blob();
        if (!blob || blob.size === 0) {
            console.error('Blob is empty or invalid');
          throw new Error('Blob is empty or invalid');
        }
  

        // Generate a unique filename
        const fileExt = uri.split('.').pop()?.toLowerCase() || 'file';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${folder}/${fileType}s/${fileName}`;
  
        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, blob, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
  
        // Retrieve the public URL correctly
        const { data } = supabase.storage.from('media').getPublicUrl(filePath);
        const publicUrl = data?.publicUrl;
  
        if (!publicUrl) {
            console.error('Failed to retrieve public URL');
          throw new Error('Failed to retrieve public URL');
        }
  

        return { publicUrl };
      } catch (err) {
        console.error(`Failed to upload ${fileType}:`, err);
        throw new Error(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };
  