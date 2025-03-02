// cropImage.js
export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  fileName = 'cropped.jpeg'
) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      canvas.width = 728 * 2;
      canvas.height = 90 * 2;
      canvas.style.width = '728px';
      canvas.style.height = '90px';

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Get actual crop coordinates from original image
      const actualCrop = {
        x: pixelCrop.x * scaleX,
        y: pixelCrop.y * scaleY,
        width: pixelCrop.width * scaleX,
        height: pixelCrop.height * scaleY
      };

      // Maintain aspect ratio while scaling
      const scaleFactor = Math.max(
        canvas.width / actualCrop.width,
        canvas.height / actualCrop.height
      );

      // Draw the cropped image on the canvas.
      // pixelCrop contains the { x, y, width, height } from react-easy-crop.
      ctx.drawImage(
        image,
        actualCrop.x,
        actualCrop.y,
        actualCrop.width,
        actualCrop.height,
        0,
        0,
        actualCrop.width * scaleFactor, // Scale up/down properly
        actualCrop.height * scaleFactor
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            //reject(new Error('Canvas is empty'));
            console.error('Canvas is empty');
            return;
          }
          const file = new File([blob], fileName, { type: 'image/jpeg', lastModified: Date.now() });
          resolve(file);
        },
        'image/jpeg',
        0.95 // 95% quality
      );
    };
    image.onerror = (error) => {
      reject(error);
    };
  });
};

// Updated validation for 8:1 ratio banner
export const validateImageFile = (file: File): Promise<unknown> => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  // Additional check for image dimensions (if needed)
  const img = new Image();
  img.src = URL.createObjectURL(file);

  return new Promise((resolve) => {
    img.onload = () => {
      const isValid =
        file.size <= maxSize && allowedTypes.includes(file.type) && img.width / img.height >= 8;
      URL.revokeObjectURL(img.src);
      resolve(isValid);
    };
  });
};
