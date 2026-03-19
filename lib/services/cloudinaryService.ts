import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image from a URL to Cloudinary
 * Helps in permanent hosting for AI-generated images
 */
export async function uploadFromUrl(url: string, folder: string = 'newsphere/articles') {
  try {
    if (!url || url.includes('picsum.photos')) {
        return url; // Skip placeholders or invalid URLs
    }

    const result = await cloudinary.uploader.upload(url, {
      folder,
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (error: any) {
    console.warn('[CloudinaryService] Upload failed, falling back to original URL:', error.message);
    return url;
  }
}
