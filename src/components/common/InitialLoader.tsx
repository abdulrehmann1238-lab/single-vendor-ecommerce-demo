import React, { useEffect, useState } from 'react';
import { useCommerceStore } from '../../store/useCommerceStore';

export const InitialLoader: React.FC = () => {
  const { hasLoadedInitialSplash, completeInitialSplash } = useCommerceStore();
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // If already loaded in session, do not repeat
    if (hasLoadedInitialSplash) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFadingOut(true);
          setTimeout(() => {
            completeInitialSplash();
          }, 450);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [hasLoadedInitialSplash, completeInitialSplash]);

  if (hasLoadedInitialSplash) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-ivory transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-102' : 'opacity-100'
      }`}
      aria-label="Loading Atelier & Co."
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center animate-fade-in">
        {/* Monogram emblem */}
        <div className="w-12 h-12 mb-6 border border-delicate rounded-full flex items-center justify-center text-forest bg-white shadow-subtle">
          <span className="font-serif text-xl tracking-tighter">A&C</span>
        </div>

        {/* Wordmark */}
        <h1 className="font-serif text-2xl md:text-3xl text-charcoal tracking-wide mb-2">
          ATELIER & CO.
        </h1>
        <p className="text-xs uppercase tracking-widest text-muted mb-8 font-sans">
          Considered Goods • Crafted for Everyday
        </p>

        {/* Delicate progress bar */}
        <div className="w-48 h-0.5 bg-delicate overflow-hidden rounded-full mb-3">
          <div
            className="h-full bg-forest transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text */}
        <span className="text-[11px] text-muted tracking-widest uppercase font-mono">
          {progress < 40 ? 'Synchronizing catalog...' : progress < 80 ? 'Preparing curated edits...' : 'Opening gallery...'}
        </span>
      </div>
    </div>
  );
};
