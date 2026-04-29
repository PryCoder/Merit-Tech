'use client';

// Only Heroicons imports - all used in the component
import {
  SparklesIcon,
  EyeSlashIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  CalendarIcon,
  DocumentTextIcon,
  BellIcon,
  ShareIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';

import { AnimatedList } from '@/components/ui/animated-list';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { Marquee } from '@/components/ui/marquee';
import { Globe } from '@/components/ui/globe';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { AnimatedBeamDemo } from './beam';
import { Box } from '@chakra-ui/react';
import WorldMap from '@/components/ui/world-map';
import { GlobeSections } from './globesection';

const files = [
  {
    name: 'bitcoin.pdf',
    body: 'Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.',
  },
  {
    name: 'finances.xlsx',
    body: 'A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.',
  },
  {
    name: 'logo.svg',
    body: 'Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.',
  },
  {
    name: 'keys.gpg',
    body: 'GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.',
  },
  {
    name: 'seed.txt',
    body: 'A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.',
  },
];

// Circle component for nodes
type CircleProps = {
  className?: string;
  children?: React.ReactNode;
};

const Circle = forwardRef<HTMLDivElement, CircleProps>(
  ({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        'z-10 flex items-center justify-center rounded-full border-2 bg-black/60 backdrop-blur-sm shadow-lg',
        className
      )}
    >
      {children}
    </div>
  )
);

Circle.displayName = 'Circle';

// Component for Ghost Replay with properly connected beam (multi-node like the demo)
function GhostReplayBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const middleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <AnimatedBeamDemo />
    </div>
  );
}

// Custom Globe Component (extracted from FeaturesSectionDemo)
function CustomGlobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let phi = 0;
    let globeInstance: any = null;

    const initGlobe = async () => {
      if (!canvasRef.current || !isClient) return;

      try {
        // Dynamically import cobe to avoid SSR issues
        const cobe = await import('cobe');

        const globeOptions: any = {
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
            { location: [34.0522, -118.2437], size: 0.05 }, // Los Angeles
            { location: [31.2304, 121.4737], size: 0.07 }, // Shanghai
            { location: [28.6139, 77.209], size: 0.06 }, // Delhi
            { location: [-22.9068, -43.1729], size: 0.05 }, // Rio de Janeiro
          ],
          onRender: (state: any) => {
            // Called on every animation frame
            state.phi = phi;
            phi += 0.003; // Slower rotation for smoother effect
          },
        };

        globeInstance = cobe.default(canvasRef.current, globeOptions);
      } catch (error) {
        console.error('Failed to initialize globe:', error);
      }
    };

    initGlobe();

    return () => {
      if (globeInstance && typeof globeInstance.destroy === 'function') {
        globeInstance.destroy();
      }
    };
  }, [isClient]);

  if (!isClient) {
    return <div className={cn('bg-black/20 rounded-full', className)} />;
  }

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

export function GlobeSection() {
  const [mounted, setMounted] = useState(false);
  const [useCustomGlobe, setUseCustomGlobe] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if the imported Globe works, if not use custom
    // You can set this based on your preference
    setUseCustomGlobe(true); // Set to true to use CustomGlobe, false to use imported Globe
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-950/20 to-purple-950/20">
      <div className="relative flex h-full w-full items-center justify-center">
        {/* GLOBE - Use CustomGlobe or imported Globe */}
        <div className="relative w-[500px] h-[500px] z-10">
          {useCustomGlobe ? (
            <CustomGlobe className="absolute inset-0 w-full h-full" />
          ) : (
            <Globe className="absolute inset-0 w-full h-full" />
          )}
        </div>

        {/* TEXT OVERLAY */}
        <div className="absolute z-20 text-white/80 text-5xl font-semibold pointer-events-none">
          Global
        </div>

        {/* GLOW EFFECT */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,230,53,0.15),transparent_70%)] z-0" />
      </div>
    </div>
  );
}

const features = [
  {
    Icon: SparklesIcon,
    name: 'AI Mentor',
    description:
      'LangGraph-powered hints that adapt to your exact approach — not generic suggestions.',
    href: '#',
    cta: 'Try AI Mentor',
    className:
      'col-span-3 lg:col-span-1 bg-black/40 border-white/10 hover:bg-black/60',
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              'relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4',
              'border-white/10 bg-white/5 hover:bg-white/10',
              'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none'
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <DocumentTextIcon className="h-4 w-4 text-white/60" />
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium text-white">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs text-gray-300">
              {f.body}
            </blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: EyeSlashIcon,
    name: 'Blind Hiring',
    description:
      'Cryptographic identity hashing hides name, college, and company until merit threshold is crossed.',
    href: '#',
    cta: 'Explore Blind Mode',
    className:
      'col-span-3 lg:col-span-2 bg-black/40 border-white/10 hover:bg-black/60',
    background: (
      <AnimatedList className="absolute top-4 right-2 h-[300px] w-full scale-75 border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90">
        {files.map((f, idx) => (
          <div
            key={idx}
            className={cn(
              'rounded-lg border p-3 text-xs flex items-center gap-2',
              'border-white/10 bg-white/5 text-gray-300'
            )}
          >
            <BellIcon className="h-3 w-3 text-white/40" />
            <span className="truncate">{f.name}</span>
          </div>
        ))}
      </AnimatedList>
    ),
  },
  {
    Icon: CursorArrowRaysIcon,
    name: 'Ghost Replay',
    description:
      'Full thinking timeline — recruiters see how you solved, not just final answers.',
    href: '#',
    cta: 'Watch Replay',
    className:
      'col-span-3 lg:col-span-2 bg-black/40 border-white/10 hover:bg-black/60',
    background: <GhostReplayBackground />,
  },
  {
    Icon: FingerPrintIcon,
    name: 'Merit Scoring',
    description:
      'Multi-dimensional scoring: correctness, efficiency, readability, and reasoning quality.',
    className:
      'col-span-3 lg:col-span-1 bg-black/40 border-white/10 hover:bg-black/60',
    href: '#',
    cta: 'View Score Model',
    background: (
      <div className="absolute inset-0">
        <Calendar
          mode="single"
          selected={new Date(2022, 4, 11, 0, 0, 0)}
          className="absolute top-10 right-0 origin-top scale-75 rounded-md border border-white/10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90 bg-white/5 text-white"
        />
        <div className="absolute bottom-2 left-2">
          <CalendarIcon className="h-4 w-4 text-white/30" />
        </div>
      </div>
    ),
  },
  {
    Icon: GlobeAltIcon,
    name: 'Global Reach',
    description:
      'Connect with talent worldwide through our decentralized platform spanning 50+ countries.',
    href: '#',
    cta: 'Explore Global Network',
    className:
      'col-span-3 lg:col-span-3 bg-black/40 border-white/10 hover:bg-black/60 min-h-[400px]',
    background: (
      <Box position="absolute" inset={0} w="full" h="full">
        <GlobeSections />
      </Box>
    ),
  },
];

export function BentoDemo() {
  return (
    <div className="dark bg-black min-h-screen p-8">
      <BentoGrid>
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}
