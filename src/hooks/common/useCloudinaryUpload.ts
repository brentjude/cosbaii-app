// Update: src/hooks/common/useCloudinaryUpload.ts
import { useState } from 'react';

interface UploadOptions {
  folder?: string;
  uploadPreset: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (
    file: File,
    options: UploadOptions
  ): Promise<{ url: string; publicId: string } | null> => {
    setUploading(true);
    setError(null);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      // Get upload signature from your API
      const timestamp = Math.round(new Date().getTime() / 1000);
      
      const signatureResponse = await fetch('/api/upload/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp,
          upload_preset: options.uploadPreset,
          folder: options.folder,
        }),
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to get upload signature');
      }

      const { signature, api_key, cloud_name } = await signatureResponse.json();

      // Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', api_key);
      formData.append('upload_preset', options.uploadPreset);
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }

      // Upload to Cloudinary
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const result = await cloudinaryResponse.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const uploadResult = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      options.onSuccess?.(result);
      return uploadResult;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload image';
      setError(errorMessage);
      options.onError?.(err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Function to delete image
  const deleteImage = async (imageUrl: string, publicId?: string) => {
    try {
      const response = await fetch('/api/upload/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, publicId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    error,
  };
};