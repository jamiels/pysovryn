import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';

const CropModal = ({
  imageSrc,
  onCancel,
  onCropComplete
}: {
  imageSrc: string;
  onCancel: () => void;
  onCropComplete: (croppedAreaPixels: Area) => void;
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = () => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels);
    }
  };

  return (
    <div className=" crop-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="crop-container bg-white dark:bg-dark p-4 rounded shadow-lg">
        <div className="relative w-[500px] h-[333px] bg-gray-200">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={3}
            cropShape="rect"
            showGrid={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleCrop}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
