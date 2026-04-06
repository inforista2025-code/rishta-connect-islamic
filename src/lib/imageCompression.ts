/**
 * Client-side image compression utility
 * Resizes to max 800px width, converts to WebP at 75% quality
 * Target: under 300KB
 */

export async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }

        // Calculate new dimensions (max width 800px)
        let { width, height } = img;
        const MAX_WIDTH = 800;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first at 75% quality
        let quality = 0.75;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Compression failed'));
                return;
              }

              // If still over 300KB and quality can be reduced
              if (blob.size > 300 * 1024 && quality > 0.4) {
                quality -= 0.1;
                tryCompress();
                return;
              }

              const baseName = file.name.replace(/\.[^.]+$/, '');
              const compressed = new File([blob], `${baseName}.webp`, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressed);
            },
            'image/webp',
            quality
          );
        };

        tryCompress();
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
