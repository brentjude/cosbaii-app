// Update: src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

export default cloudinary;

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
  transformation?: object
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    // ✅ Base upload options
    const uploadOptions: any = {
      folder,
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto',
      unique_filename: true,
      overwrite: false,
    };

    // ✅ Apply transformations if provided
    if (transformation) {
      uploadOptions.transformation = transformation;
    }

    console.log('Cloudinary upload options:', uploadOptions);

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          console.log('Cloudinary upload result:', {
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            bytes: result.bytes
          });
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(new Error('Upload failed - no result'));
        }
      }
    );

    uploadStream.end(buffer);
  });
};

// Helper function to generate upload signature
export const generateUploadSignature = (paramsToSign: Record<string, string>) => {
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return signature;
};

// Helper function to delete images
export const deleteImageFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted from Cloudinary:', result);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image: ${result.result}`);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

// Helper function to extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (imageUrl: string): string | null => {
  try {
    // Example URL: https://res.cloudinary.com/dubdawmgh/image/upload/v1754707041/cosbaii/profiles/profile/b6wyfoyzddivhxt9zon3.png
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      return null;
    }
    
    // Get everything after 'upload/v{version}/' 
    const pathAfterVersion = urlParts.slice(uploadIndex + 2).join('/');
    
    // Remove file extension
    const publicId = pathAfterVersion.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};