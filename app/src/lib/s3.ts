import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Configuration
const s3Client = new S3Client({
  region: import.meta.env.VITE_S3_REGION || 'auto',
  endpoint: import.meta.env.VITE_S3_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Required for some S3-compatible services
});

export async function uploadPhotoToS3(base64: string, batchId: string, index: number): Promise<string> {
  try {
    // Remove the data URL prefix to get the base64 string
    const base64Data = base64.replace(/^data:image\/(png|jpeg);base64,/, "");
    const fileExt = base64.startsWith("data:image/png") ? "png" : "jpg";
    const fileName = `${batchId}_${index}.${fileExt}`;
    const fileKey = `collections/${batchId}/${fileName}`;

    // Convert base64 to Uint8Array (browser-compatible)
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const uint8Array = new Uint8Array(byteNumbers);

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: import.meta.env.VITE_S3_BUCKET_NAME || 'photos',
      Key: fileKey,
      Body: uint8Array,
      ContentType: `image/${fileExt}`,
    });

    await s3Client.send(command);

    // Generate a signed URL that's valid for 7 days (maximum allowed)
    const getCommand = new GetObjectCommand({
      Bucket: import.meta.env.VITE_S3_BUCKET_NAME || 'photos',
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(s3Client, getCommand, { 
      expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds (maximum allowed)
    });
    
    return signedUrl;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`S3 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to generate signed URLs for existing photos
export async function getSignedPhotoUrl(photoPath: string): Promise<string> {
  try {
    const getCommand = new GetObjectCommand({
      Bucket: import.meta.env.VITE_S3_BUCKET_NAME || 'photos',
      Key: photoPath,
    });

    const signedUrl = await getSignedUrl(s3Client, getCommand, { 
      expiresIn: 24 * 60 * 60 // 24 hours
    });
    
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}