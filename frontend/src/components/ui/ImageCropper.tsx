import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import getCroppedImg from '@/lib/cropImage';

interface ImageCropperProps {
  src: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

export function ImageCropper({ src, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !src) return;
    try {
      setIsLoading(true);
      const croppedImageBlob = await getCroppedImg(src, croppedAreaPixels);
      if (croppedImageBlob) {
        onCropComplete(croppedImageBlob);
      }
    } catch (e) {
      console.error('Error cropping image:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  // Don't render if no image source
  if (!src) return null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent 
        className="sm:max-w-[500px] p-0 overflow-hidden"
        style={{
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Upload Photo
          </DialogTitle>
        </DialogHeader>

        {/* Crop Area with circular mask */}
        <div 
          className="relative w-full h-80 bg-gray-900 overflow-hidden mx-auto"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: {
                background: 'transparent',
              },
              cropAreaStyle: {
                border: '3px solid white',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              },
            }}
          />
        </div>

        {/* Drag hint */}
        <p className="text-center text-sm text-gray-500 mt-2">
          Drag image to reposition
        </p>

        {/* Zoom Slider */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 w-12">Zoom</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(val) => setZoom(val[0])}
              className="flex-1"
            />
            <span className="text-sm text-gray-500 w-8 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="px-6 pb-6 pt-2 gap-3">
          <Button 
            variant="outline" 
            onClick={handleCancel} 
            disabled={isLoading}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !croppedAreaPixels}
            className="flex-1 h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
          >
            {isLoading ? (
              <>
                <span className="animate-pulse mr-2">●</span>
                Saving...
              </>
            ) : (
              'Save Image'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
