import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ExternalLink,
  Maximize2,
  RefreshCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminPhotoPreviewModalProps {
  isOpen: boolean;
  photos: string[];
  initialIndex?: number;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

export function AdminPhotoPreviewModal({
  isOpen,
  photos,
  initialIndex = 0,
  title,
  subtitle,
  onClose,
}: AdminPhotoPreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.min(Math.max(0, initialIndex), Math.max(0, photos.length - 1)));
      setScale(1);
      setRotation(0);
    }
  }, [isOpen, initialIndex, photos.length]);

  const handlePrev = useCallback(() => {
    setScale(1);
    setRotation(0);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  }, [photos.length]);

  const handleNext = useCallback(() => {
    setScale(1);
    setRotation(0);
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  }, [photos.length]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.3, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.3, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black/95 text-white animate-in fade-in duration-200 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex flex-col max-w-[70%]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base sm:text-lg truncate">
              {title || 'Profile Photo Preview'}
            </span>
            {photos.length > 1 && (
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">
                {currentIndex + 1} / {photos.length}
              </span>
            )}
          </div>
          {subtitle && (
            <span className="text-xs text-white/70 truncate">{subtitle}</span>
          )}
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom In */}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-white/90 hover:bg-white/20 hover:text-white rounded-full"
            onClick={handleZoomIn}
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          {/* Zoom Out */}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-white/90 hover:bg-white/20 hover:text-white rounded-full"
            onClick={handleZoomOut}
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>

          {/* Reset Zoom */}
          {(scale !== 1 || rotation !== 0) && (
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-white/90 hover:bg-white/20 hover:text-white rounded-full"
              onClick={handleReset}
              title="Reset View"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          )}

          {/* Rotate */}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-white/90 hover:bg-white/20 hover:text-white rounded-full"
            onClick={handleRotate}
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4" />
          </Button>

          {/* Open in new tab */}
          <a
            href={currentPhoto}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-9 w-9 text-white/90 hover:bg-white/20 hover:text-white rounded-full transition-colors"
            title="Open Original Image in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Close button */}
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 bg-white/10 text-white hover:bg-red-600 hover:text-white rounded-full ml-1"
            onClick={onClose}
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Left Arrow */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 z-20 h-12 w-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white transition-all shadow-lg hover:scale-110 active:scale-95"
            title="Previous Photo (Left Arrow)"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* The Image */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            cursor: scale > 1 ? 'grab' : 'default',
          }}
        >
          <img
            src={currentPhoto}
            alt={title || 'Profile Photo'}
            className="max-w-[90vw] max-h-[75vh] object-contain rounded-lg shadow-2xl transition-all"
            draggable={false}
          />
        </div>

        {/* Right Arrow */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 z-20 h-12 w-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white transition-all shadow-lg hover:scale-110 active:scale-95"
            title="Next Photo (Right Arrow)"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip (if multiple photos) */}
      {photos.length > 1 && (
        <div className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-t from-black/90 to-transparent z-10 overflow-x-auto">
          {photos.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setScale(1);
                setRotation(0);
                setCurrentIndex(idx);
              }}
              className={`relative h-14 w-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                idx === currentIndex
                  ? 'border-primary ring-2 ring-primary/50 scale-105 opacity-100'
                  : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white'
              }`}
            >
              <img
                src={url}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
