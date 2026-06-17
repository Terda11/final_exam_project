"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < images.length - 1;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-700 group border border-surface-600">
        <Image
          key={images[selectedIndex]}
          src={getImageUrl(images[selectedIndex] ?? null)}
          alt={`${productName}${images.length > 1 ? ` — view ${selectedIndex + 1}` : ""}`}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((i) => Math.max(0, i - 1))}
              disabled={!hasPrev}
              aria-label="Previous image"
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full",
                "bg-surface-800/80 backdrop-blur-sm shadow-glass flex items-center justify-center",
                "transition-all duration-150",
                hasPrev
                  ? "opacity-0 group-hover:opacity-100 hover:bg-surface-700 hover:scale-110"
                  : "opacity-0 pointer-events-none"
              )}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setSelectedIndex((i) => Math.min(images.length - 1, i + 1))}
              disabled={!hasNext}
              aria-label="Next image"
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full",
                "bg-surface-800/80 backdrop-blur-sm shadow-glass flex items-center justify-center",
                "transition-all duration-150",
                hasNext
                  ? "opacity-0 group-hover:opacity-100 hover:bg-surface-700 hover:scale-110"
                  : "opacity-0 pointer-events-none"
              )}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  aria-label={`View ${i + 1}`}
                  aria-current={i === selectedIndex ? "true" : undefined}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-150",
                    i === selectedIndex
                      ? "bg-brand-400 w-4"
                      : "bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              aria-label={`Show view ${i + 1}`}
              aria-pressed={i === selectedIndex}
              className={cn(
                "relative flex-none w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-150",
                i === selectedIndex
                  ? "border-brand-500 shadow-glow-blue scale-95"
                  : "border-surface-600 hover:border-surface-400 hover:scale-95"
              )}
            >
              <Image
                src={getImageUrl(img)}
                alt={`${productName} — thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
