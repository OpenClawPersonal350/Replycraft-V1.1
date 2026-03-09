import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation: number): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const newWidth = image.width * cos + image.height * sin;
  const newHeight = image.width * sin + image.height * cos;

  canvas.width = newWidth;
  canvas.height = newHeight;
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.95);
  });
}

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = useCallback((_: unknown, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (croppedAreaPixels) {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(blob);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-card border border-border rounded-3xl w-full max-w-md mx-4 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="text-base font-semibold text-foreground">Adjust Photo</h3>
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Cropper Area */}
          <div className="relative aspect-square bg-black mx-5 rounded-2xl overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropChange}
              classes={{
                containerClassName: "rounded-2xl",
                cropAreaClassName: "!border-2 !border-white/30",
              }}
              style={{
                cropAreaStyle: {
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                },
              }}
            />
          </div>

          {/* Controls */}
          <div className="px-5 pt-5 pb-2 space-y-4">
            {/* Zoom */}
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-muted-foreground shrink-0" />
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.01}
                onValueChange={([v]) => setZoom(v)}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>

            {/* Rotate Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted/50"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Rotate
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-5 pb-5 pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-11 rounded-xl border-border text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-11 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 font-medium"
            >
              Update Photo
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageCropper;
