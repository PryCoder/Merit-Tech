'use client';

import React, { forwardRef, useRef } from 'react';
import {
  SparklesIcon,
  EyeSlashIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  CodeBracketIcon,
  CloudIcon,
  UsersIcon,
} from '@heroicons/react/24/solid'; // Changed from outline to solid

import { cn } from '@/lib/utils';
import { AnimatedBeam } from '@/components/ui/animated-beam';

/* ---------------- ICONS OBJECT ---------------- */
const Icons = {
  cloud: CloudIcon,
  code: CodeBracketIcon,
  users: UsersIcon,
  sparkles: SparklesIcon,
  fingerprint: FingerPrintIcon,
  eye: EyeSlashIcon,
  cursor: CursorArrowRaysIcon,
};

/* ---------------- CIRCLE ---------------- */
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-gradient-to-br from-white to-gray-100 p-3 shadow-lg text-gray-700',
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = 'Circle';

/* ---------------- COMPONENT ---------------- */
export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  const Cloud = Icons.cloud;
  const Code = Icons.code;
  const Users = Icons.users;
  const Sparkles = Icons.sparkles;
  const Fingerprint = Icons.fingerprint;
  const Eye = Icons.eye;
  const Cursor = Icons.cursor;

  return (
    <div
      className="relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row justify-between">
          <Circle ref={div1Ref}>
            <Cloud className="h-6 w-6 text-blue-500" />
          </Circle>

          <Circle ref={div5Ref}>
            <Code className="h-6 w-6 text-purple-500" />
          </Circle>
        </div>

        <div className="flex flex-row justify-between">
          <Circle ref={div2Ref}>
            <Users className="h-6 w-6 text-green-500" />
          </Circle>

          <Circle
            ref={div4Ref}
            className="size-16 bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </Circle>

          <Circle ref={div6Ref}>
            <Fingerprint className="h-6 w-6 text-cyan-500" />
          </Circle>
        </div>

        <div className="flex flex-row justify-between">
          <Circle ref={div3Ref}>
            <Eye className="h-6 w-6 text-amber-500" />
          </Circle>

          <Circle ref={div7Ref}>
            <Cursor className="h-6 w-6 text-rose-500" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        pathColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        pathColor="#22c55e"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        pathColor="#f59e0b"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        pathColor="#a855f7"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        pathColor="#06b6d4"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        pathColor="#f43f5e"
      />
    </div>
  );
}
