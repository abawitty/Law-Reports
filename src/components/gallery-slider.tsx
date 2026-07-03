"use client";

import { useEffect, useState } from "react";

type Photo = { id: string; caption: string | null };

export function GallerySlider({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-black">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-[16/9] w-full shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/gallery-photo/${photo.id}`}
              alt={photo.caption ?? "TEIN-KUC activity photo"}
              className="h-full w-full object-cover"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm text-white sm:px-6">
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => setIndex((i) => (i + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
