export interface MediaUploadData {
  uri: string;
  fileType: 'image' | 'video';
  folder: string;
}

export interface MediaUploadResult {
  publicUrl: string;
} 