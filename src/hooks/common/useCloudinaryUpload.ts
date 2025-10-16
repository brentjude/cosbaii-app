"use client";

import { useState, useCallback } from "react";

interface UploadOptions {
  uploadPreset: string;
  folder?: string;
  onSuccess?: (result: CloudinaryUploadResult) => void;
  onError?: (error: Error) => void;
}

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadImage = useCallback(
    async (
      file: File,
      options: UploadOptions
    ): Promise<CloudinaryUploadResult | null> => {
      setUploading(true);
      setError(null);
      setProgress(0);

      try {
        // ✅ Get cloud name from environment
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        
        if (!cloudName) {
          console.error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
          throw new Error(
            "Cloudinary configuration missing. Please contact support."
          );
        }

        // ✅ Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error("Only image files are allowed");
        }

        // ✅ Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error("File size must be less than 10MB");
        }

        // ✅ Prepare form data for unsigned upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", options.uploadPreset);
        
        if (options.folder) {
          formData.append("folder", options.folder);
        }

        // ✅ Add timestamp for cache busting
        formData.append("timestamp", Math.round(Date.now() / 1000).toString());

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        console.log("📤 Starting Cloudinary upload:", {
          cloudName,
          uploadPreset: options.uploadPreset,
          folder: options.folder,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          fileType: file.type,
        });

        // ✅ Upload with XMLHttpRequest for progress tracking
        const response = await new Promise<CloudinaryUploadResult>(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            xhr.upload.addEventListener("progress", (e) => {
              if (e.lengthComputable) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                setProgress(percentComplete);
                console.log(`📊 Upload progress: ${percentComplete}%`);
              }
            });

            // Handle successful upload
            xhr.addEventListener("load", () => {
              if (xhr.status === 200) {
                try {
                  const result = JSON.parse(xhr.responseText);
                  console.log("✅ Upload successful:", {
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    size: `${(result.bytes / 1024).toFixed(2)} KB`,
                  });

                  resolve({
                    url: result.secure_url || result.url,
                    publicId: result.public_id,
                    secureUrl: result.secure_url,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    bytes: result.bytes,
                  });
                } catch (parseError) {
                  console.error("❌ Failed to parse Cloudinary response:", parseError);
                  reject(new Error("Failed to parse upload response"));
                }
              } else {
                // Handle error response
                try {
                  const errorResponse = JSON.parse(xhr.responseText);
                  console.error("❌ Upload failed:", {
                    status: xhr.status,
                    error: errorResponse,
                  });

                  reject(
                    new Error(
                      errorResponse.error?.message ||
                        `Upload failed with status ${xhr.status}`
                    )
                  );
                } catch {
                  console.error("❌ Upload failed with status:", xhr.status);
                  reject(new Error(`Upload failed with status ${xhr.status}`));
                }
              }
            });

            // Handle network error
            xhr.addEventListener("error", () => {
              console.error("❌ Network error during upload");
              reject(
                new Error(
                  "Network error. Please check your internet connection."
                )
              );
            });

            // Handle timeout
            xhr.addEventListener("timeout", () => {
              console.error("❌ Upload timeout");
              reject(new Error("Upload timeout. Please try again."));
            });

            // Send request
            xhr.open("POST", cloudinaryUrl);
            xhr.timeout = 60000; // 60 seconds
            xhr.send(formData);
          }
        );

        // Call success callback
        if (options.onSuccess) {
          options.onSuccess(response);
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";

        console.error("❌ Cloudinary upload error:", {
          error: err,
          message: errorMessage,
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: options.uploadPreset,
        });

        setError(errorMessage);

        // Call error callback
        if (options.onError) {
          options.onError(err instanceof Error ? err : new Error(errorMessage));
        }

        return null;
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    []
  );

  return {
    uploadImage,
    uploading,
    error,
    progress,
  };
};