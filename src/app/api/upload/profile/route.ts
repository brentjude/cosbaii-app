// Update: src/app/api/upload/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { 
  deleteImageFromCloudinary, 
  extractPublicIdFromUrl,
  uploadToCloudinary  // ✅ Add this import
} from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    console.log('Upload request received:', { fileName: file?.name, type });

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || !['profile', 'cover'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid upload type. Must be "profile" or "cover"' 
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 });
    }

    console.log(`Uploading ${type} image:`, file.name, 'Size:', file.size, 'bytes');

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ Upload to Cloudinary with proper folder structure
    const folder = `cosbaii/${type === 'profile' ? 'profiles' : 'covers'}`;
    const result = await uploadToCloudinary(buffer, folder, {
      quality: 'auto:good',
      fetch_format: 'auto',
      ...(type === 'profile' && {
        width: 400,
        height: 400,
        crop: 'fill',
        gravity: 'face'
      }),
      ...(type === 'cover' && {
        width: 1200,
        height: 300,
        crop: 'fill'
      })
    });

    console.log('Cloudinary upload successful:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      message: `${type === 'profile' ? 'Profile' : 'Cover'} image uploaded successfully`
    });

  } catch (error) {
    console.error('Error uploading profile image:', error);
    
    // Handle specific Cloudinary errors
    if (error && typeof error === 'object' && 'error' in error) {
      const cloudinaryError = error as any;
      if (cloudinaryError.error?.message) {
        return NextResponse.json({
          error: `Upload failed: ${cloudinaryError.error.message}`
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}