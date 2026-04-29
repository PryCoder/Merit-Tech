'use client';

import { Globe } from '@/components/ui/globe';
import { useEffect, useState, useRef } from 'react';

export function GlobeSection() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none">
      {/* GLOBE WRAPPER */}
      <div className="relative w-[650px] h-[650px] z-20">
        {/* If the imported Globe component doesn't work, use this custom implementation */}
        <CustomGlobe className="w-full h-full" />

        {/* Or use the imported Globe if available */}
        {/* <Globe className="w-full h-full" /> */}
      </div>

      {/* TEXT OVERLAY */}
      <div className="absolute z-30 text-white/80 text-4xl font-semibold pointer-events-none">
        Global
      </div>

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,230,53,0.12),transparent_60%)] pointer-events-none" />
    </div>
  );
}

// Custom Globe Component (extracted from your FeaturesSectionDemo)
function CustomGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    let globeInstance: any = null;

    const initGlobe = async () => {
      if (!canvasRef.current) return;

      // Dynamically import cobe to avoid SSR issues
      const cobe = await import('cobe');

      globeInstance = cobe.default(canvasRef.current, {
        devicePixelRatio: 2,
        width: 600 * 2,
        height: 600 * 2,
        phi: 0,
        theta: 0,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 4000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [0.1, 0.8, 1],
        glowColor: [1, 1, 1],
        markers: [
          // longitude, latitude
          { location: [37.7595, -122.4367], size: 0.03 }, // San Francisco
          { location: [40.7128, -74.006], size: 0.1 }, // New York
          { location: [51.5074, -0.1278], size: 0.08 }, // London
          { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
          { location: [-33.8688, 151.2093], size: 0.06 }, // Sydney
          { location: [19.076, 72.8777], size: 0.07 }, // Mumbai
          { location: [55.7558, 37.6173], size: 0.07 }, // Moscow
          { location: [-23.5505, -46.6333], size: 0.06 }, // Sao Paulo
        ],
      });
    };

    initGlobe();

    const animationFrameId = requestAnimationFrame(function animate() {
      if (globeInstance) {
        globeInstance.phi = phi;
        phi += 0.005; // Slower rotation for smoother effect
      }
      requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (globeInstance && typeof globeInstance.destroy === 'function') {
        globeInstance.destroy();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        aspectRatio: 1,
      }}
      className={className}
    />
  );
}
