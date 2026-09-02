/**
 * Image Processing & Optimization Utility
 * Converts uploaded images to optimized Base64 data URIs for permanent storage in MongoDB.
 * Ensures images work instantly on Vercel, Render, local dev, and mobile devices without disk storage dependencies.
 */

export const compressImageToBase64 = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if canvas is not supported
          resolve(event.target.result);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG Data URI
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = (err) => {
        reject(new Error('Failed to load image for compression: ' + err.message));
      };
    };

    reader.onerror = (err) => {
      reject(new Error('Failed to read image file: ' + err.message));
    };
  });
};

/**
 * Resolves full image URL considering static assets, base64 strings, and backend upload paths
 */
export const getImageUrl = (url, fallback = '/assets/images/temple-structure.jpg') => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const trimmed = url.trim();

  // 1. Base64 Data URI or blob or external HTTP(S) URL
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  // 2. Bundled static assets on frontend (/assets/...)
  if (trimmed.startsWith('/assets/')) {
    return trimmed;
  }

  // 3. Backend uploads path (/uploads/...)
  if (trimmed.startsWith('/uploads/')) {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const backendBase = apiUrl.replace(/\/api\/?$/, '');
    return backendBase ? `${backendBase}${trimmed}` : trimmed;
  }

  return trimmed;
};
