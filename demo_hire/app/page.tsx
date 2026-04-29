'use client';

/**
 * SkillProof — Full Landing Page
 * Stack: Chakra UI v2 · Heroicons · Framer Motion · 6 Font Families
 * Theme: Dark editorial · Obsidian + Acid-Lime + Electric-Violet
 *
 * Fonts used:
 *  1. Bebas Neue      — hero display / big numbers
 *  2. Instrument Serif — italic editorial accent
 *  3. Syne            — section headings
 *  4. DM Sans         — body / UI text
 *  5. Space Mono      — code / mono labels
 *  6. Cabinet Grotesk — CTAs / badges
 *
 * Install:
 *   npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
 *       @heroicons/react
 * Add to index.html <head>:
 *   <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
 *   <!-- Cabinet Grotesk via Fontshare (self-host or use CDN below) -->
 *   <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap" rel="stylesheet">
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import {
  Box,
  Flex,
  Grid,
  Text,
  Heading,
  Button,
  Badge,
  Container,
  Stack,
  HStack,
  VStack,
  Tag,
  Divider,
  Icon,
  useColorModeValue,
  ChakraProvider,
  extendTheme,
  Image,
  SimpleGrid,
  Circle,
  Square,
  AspectRatio,
  IconButton,
  chakra,
} from '@chakra-ui/react';
import {
  EyeSlashIcon,
  SparklesIcon,
  TrophyIcon,
  UserGroupIcon,
  CodeBracketIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  PlayIcon,
  ChartBarIcon,
  LightBulbIcon,
  CpuChipIcon,
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  XCircleIcon,
  BeakerIcon,
  StarIcon,
  RocketLaunchIcon,
  CursorArrowRaysIcon,
  DocumentMagnifyingGlassIcon,
  FingerPrintIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolid,
  StarIcon as StarSolid,
} from '@heroicons/react/24/solid';
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from 'framer-motion';
import { RetroGrid } from '@/components/ui/retro-grid';
import { Spotlight } from '@/components/ui/spotlight-new';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { BentoDemo } from '@/compo/demo';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import {
  CheckCircleIcon,
  ChevronRight,
  Cpu,
  Crown,
  Menu,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { Marquee } from '@/components/ui/marquee';
import CTA from '@/compo/cta';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { WarpBackground } from '@/components/ui/warp-background';
import { NoiseTexture } from '@/components/ui/noise-texture';
import { AuroraText } from '@/components/ui/aurora-text';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { MagicCard } from '@/components/ui/magic-card';
import { BlurFade } from '@/components/ui/blur-fade';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { BackgroundLines } from '@/components/ui/background-lines';
import { Globe } from '@/components/ui/globe';
import { FlickeringGrid } from '@/components/ui/flickering-grid';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { CanvasText } from '@/components/ui/canvas-text';
import { Meteors } from '@/components/ui/meteors';
import Link from 'next/link';

const cn = (...args: Array<string | false | null | undefined>) =>
  args.filter(Boolean).join(' ');

const features = [
  {
    Icon: SparklesIcon,
    name: 'AI Mentor',
    description:
      'LangGraph-powered hints that adapt to your exact approach — not generic suggestions.',
    href: '#',
    cta: 'Try AI Mentor',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 via-transparent to-transparent" />
    ),
  },
  {
    Icon: EyeSlashIcon,
    name: 'Blind Hiring',
    description:
      'Cryptographic identity hashing hides name, college, and company until merit threshold is crossed.',
    href: '#',
    cta: 'Explore Blind Mode',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
    ),
  },
  {
    Icon: CursorArrowRaysIcon,
    name: 'Ghost Replay',
    description:
      'Full thinking timeline — recruiters see how you solved, not just final answers.',
    href: '#',
    cta: 'Watch Replay',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent" />
    ),
  },
  {
    Icon: FingerPrintIcon,
    name: 'Merit Scoring',
    description:
      'Multi-dimensional scoring: correctness, efficiency, readability, and reasoning quality.',
    href: '#',
    cta: 'View Score Model',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. THEME
// ─────────────────────────────────────────────────────────────────────────────
const theme = extendTheme({
  config: { initialColorMode: 'dark', useSystemColorMode: false },
  colors: {
    brand: {
      lime: '#C8F135',
      violet: '#7C3AED',
      red: '#FF4D6D',
      ink: '#0A0A0F',
      charcoal: '#111118',
      card: '#16161E',
      border: 'rgba(255,255,255,0.07)',
    },
  },
  fonts: {
    heading: "'Syne', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'Space Mono', monospace",
  },
  styles: {
    global: {
      'html, body': {
        bg: '#0A0A0F',
        color: '#FAFAF7',
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
      },
      '::selection': { background: '#C8F135', color: '#0A0A0F' },
      '*': { boxSizing: 'border-box' },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.01em',
        borderRadius: '10px',
      },
      variants: {
        lime: {
          bg: '#C8F135',
          color: '#0A0A0F',
          _hover: { bg: '#b8e020', transform: 'translateY(-1px)' },
          transition: 'all 0.2s',
        },
        ghost_white: {
          bg: 'transparent',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.14)',
          _hover: {
            bg: 'rgba(255,255,255,0.05)',
            borderColor: 'rgba(255,255,255,0.35)',
          },
          transition: 'all 0.2s',
        },
      },
    },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. MOTION HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const MotionBox = motion(chakra.div);
const MotionFlex = motion(chakra.div);
const MotionText = motion(chakra.p);

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.07 },
  }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

function ScrollReveal({
  children,
  delay = 0,
  variant = 'fadeUp',
}: {
  children: ReactNode;
  delay?: number;
  variant?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const v =
    variant === 'scaleIn' ? scaleIn : variant === 'fadeIn' ? fadeIn : fadeUp;
  return (
    <MotionBox
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={v}
      custom={delay}
    >
      {children}
    </MotionBox>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GLOBAL STYLES INJECTOR (fonts + keyframes)
// ─────────────────────────────────────────────────────────────────────────────
function GlobalCSS() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Space+Mono:wght@400;700&display=swap');
      @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');
      @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes pulseLime { 0%,100%{box-shadow:0 0 0 0 rgba(200,241,53,.35)} 50%{box-shadow:0 0 0 14px rgba(200,241,53,0)} }
      @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      .float { animation: floatY 5s ease-in-out infinite; }
      .float-d { animation: floatY 5s 1.4s ease-in-out infinite; }
      .cursor-blink { display:inline-block; width:3px; height:.82em; background:#C8F135; margin-left:4px; vertical-align:middle; animation:blink .85s step-end infinite; }
      .grain-overlay { position:fixed; inset:0; pointer-events:none; z-index:0; opacity:.028; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size:180px; }
      .marquee-track { display:flex; animation:marquee 28s linear infinite; }
      .marquee-track:hover { animation-play-state:paused; }
      .glow-lime { filter: drop-shadow(0 0 18px rgba(200,241,53,0.22)); }
      .gradient-text { background: linear-gradient(135deg,#C8F135,#6EE7B7); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Platform', 'How It Works', 'Pricing'];

  return (
    <Box
      position="fixed"
      top={0}
      w="100%"
      zIndex={1000}
      pt={{ base: 2, md: 4 }}
      px={{ base: 3, md: 6 }}
    >
      {/* NAV CONTAINER */}
      <Box
        maxW="1100px"
        mx="auto"
        borderRadius={{ base: '18px', md: '999px' }} // ✅ FIX: no extreme curve on mobile
        boxShadow="0 10px 30px rgba(0,0,0,0.45)"
        bg={scrolled ? 'rgba(15,15,15,0.9)' : 'rgba(10,10,10,0.85)'}
        backdropFilter="blur(14px)"
        border="1px solid rgba(255,255,255,0.06)"
      >
        <Container maxW="1200px" py={{ base: 2, md: 3 }}>
          <HStack justify="space-between" align="center">
            {/* LOGO */}
            <HStack spacing={3}>
              <Box
                w="34px"
                h="34px"
                borderRadius="10px"
                bg="#C8F135"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Cpu size={18} color="#000" />
              </Box>

              <Text fontWeight={800} color="white">
                SkillProof
              </Text>
            </HStack>

            {/* DESKTOP LINKS */}
            <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
              {links.map((link) => (
                <Text
                  key={link}
                  fontSize="14px"
                  color="whiteAlpha.700"
                  cursor="pointer"
                  _hover={{ color: '#C8F135' }}
                  transition="0.2s"
                >
                  {link}
                </Text>
              ))}
            </HStack>

            {/* CTA DESKTOP */}
            <HStack spacing={3} display={{ base: 'none', md: 'flex' }}>
              <Link href="/login">
                <Text fontSize="14px" color="whiteAlpha.600">
                  Sign in
                </Text>
              </Link>

              <Button
                size="sm"
                bg="#C8F135"
                color="black"
                borderRadius="full"
                _hover={{ bg: '#d4ff4a' }}
              >
                Get Started
              </Button>
            </HStack>

            {/* MOBILE BUTTON (FIXED SHAPE) */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              aria-label="menu"
              icon={open ? <X size={20} /> : <Menu size={20} />}
              onClick={() => setOpen(!open)}
              variant="ghost"
              color="white"
              w="42px"
              h="42px"
              borderRadius="12px" // ✅ FIX: removes circular feel
              _hover={{ bg: 'whiteAlpha.100' }}
              _active={{ bg: 'whiteAlpha.200', transform: 'scale(0.96)' }}
              _focusVisible={{ boxShadow: 'none' }}
            />
          </HStack>

          {/* MOBILE MENU (FIXED CARD STYLE) */}
          <AnimatePresence>
            {open && (
              <MotionBox
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                overflow="hidden"
                mt={3}
              >
                {/* MOBILE CARD (FIXED SHAPE) */}
                <Box
                  bg="rgba(15,15,15,0.95)"
                  border="1px solid rgba(255,255,255,0.08)"
                  borderRadius="16px" // ✅ FIX: no huge curve anymore
                  p={4}
                  backdropFilter="blur(12px)"
                >
                  <VStack align="stretch" spacing={4}>
                    {links.map((link) => (
                      <Text
                        key={link}
                        fontSize="15px"
                        color="whiteAlpha.800"
                        cursor="pointer"
                        _hover={{ color: '#C8F135' }}
                      >
                        {link}
                      </Text>
                    ))}
                    <Link href="/login">
                      <Text
                        fontSize="14px"
                        color="whiteAlpha.900"
                        cursor="pointer"
                        _hover={{ color: '#C8F135' }}
                        pt={2}
                      >
                        Sign in
                      </Text>
                    </Link>
                    <Box h="1px" bg="whiteAlpha.200" />

                    <Button
                      w="full"
                      bg="#C8F135"
                      color="black"
                      borderRadius="12px"
                    >
                      Get Started
                    </Button>
                  </VStack>
                </Box>
              </MotionBox>
            )}
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// 5. HERO
// ─────────────────────────────────────────────────────────────────────────────
const HERO_TYPEWRITER_WORDS = [
  'skills.',
  'thinking.',
  'code.',
  'merit.',
] as const;

function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const w = HERO_TYPEWRITER_WORDS[idx];
    const t = setTimeout(
      () => {
        if (!del) {
          if (chars < w.length) setChars((c) => c + 1);
          else setTimeout(() => setDel(true), 1600);
        } else {
          if (chars > 0) setChars((c) => c - 1);
          else {
            setDel(false);
            setIdx((i) => (i + 1) % HERO_TYPEWRITER_WORDS.length);
          }
        }
      },
      del ? 50 : 85
    );
    return () => clearTimeout(t);
  }, [chars, del, idx]);

  return (
    <Box as="span" color="brand.lime" fontFamily="'Bebas Neue', sans-serif">
      {HERO_TYPEWRITER_WORDS[idx].slice(0, chars)}
      <span className="cursor-blink" />
    </Box>
  );
}

function HeroFloatCard({ top, left, right, bottom, children }: any) {
  return (
    <Box
      position="absolute"
      top={top}
      left={left}
      right={right}
      bottom={bottom}
      bg="rgba(255,255,255,0.04)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255,255,255,0.08)"
      borderRadius="18px"
      px={5}
      py={4}
      display={{ base: 'none', xl: 'block' }}
    >
      {children}
    </Box>
  );
}

function Hero() {
  return (
    <Box
      as="section"
      position="relative"
      minH="100vh"
      overflow="hidden"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      pt="120px"
      pb="100px"
      px={6}
      textAlign="center"
    >
      <Box position="absolute" inset={0} zIndex={0} pointerEvents="none">
        <Spotlight />
      </Box>
      {/* Radial glows */}
      <Box
        position="absolute"
        top="28%"
        left="50%"
        transform="translate(-50%,-50%)"
        w="900px"
        h="600px"
        pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(200,241,53,0.07) 0%, transparent 68%)"
      />
      <Box
        position="absolute"
        bottom="10%"
        right="8%"
        w="450px"
        h="450px"
        pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, transparent 68%)"
      />
      <Box
        position="absolute"
        top="20%"
        left="5%"
        w="350px"
        h="350px"
        pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(255,77,109,0.08) 0%, transparent 68%)"
      />

      {/* Badge */}

      <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
        <span
          className={cn(
            'animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]'
          )}
          style={{
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'destination-out',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'subtract',
            WebkitClipPath: 'padding-box',
          }}
        />
        🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
        <AnimatedGradientText className="text-sm font-medium">
          Introducing SkillTech
        </AnimatedGradientText>
        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </div>

      {/* Headline */}
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <Heading
          fontFamily="'Bebas Neue', sans-serif"
          fontWeight={400}
          fontSize={{ base: '4.5rem', md: '7rem', lg: '9rem' }}
          lineHeight={0.95}
          letterSpacing="-0.02em"
          mb={5}
          className="mt-10 pointer-events-none bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-center text-8xl leading-none font-extrabold tracking-tight whitespace-pre-wrap text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]"
        >
          {' '}
          HIRED ON YOUR
          <br />
          <Typewriter />
        </Heading>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.22 }}
      >
        <Text
          fontFamily="'Instrument Serif', serif"
          fontStyle="italic"
          fontSize={{ base: '1.2rem', md: '1.6rem' }}
          fontWeight={400}
          color="rgba(255,255,255,0.38)"
          mb={10}
          maxW="560px"
          mx="auto"
          lineHeight={1.55}
        >
          "Not your résumé, not your college, not your last employer — your
          actual code."
        </Text>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.34 }}
      >
        <HStack spacing={4} justify="center" wrap="wrap">
          <Button
            variant="lime"
            size="lg"
            px={8}
            py={6}
            fontSize="16px"
            rightIcon={<Icon as={ArrowRightIcon} w={4} h={4} />}
          >
            Start Solving — Free
          </Button>
          <Button
            variant="ghost_white"
            size="lg"
            px={8}
            py={6}
            fontSize="16px"
            leftIcon={<Icon as={PlayIcon} w={4} h={4} />}
          >
            See Recruiter Demo
          </Button>
        </HStack>
      </MotionBox>

      {/* Social proof */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <HStack spacing={4} mt={12} justify="center">
          <HStack spacing={0}>
            {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'].map(
              (bg, i) => (
                <Box
                  key={i}
                  w={8}
                  h={8}
                  borderRadius="full"
                  bg={bg}
                  border="2px solid #0A0A0F"
                  ml={i === 0 ? 0 : '-10px'}
                />
              )
            )}
          </HStack>
          <Text
            fontFamily="'DM Sans', sans-serif"
            fontSize="14px"
            color="rgba(255,255,255,0.45)"
          >
            <Box as="strong" color="#fff">
              2,400+
            </Box>{' '}
            devs already solving challenges
          </Text>
        </HStack>
      </MotionBox>

      {/* Floating stat chips */}
      <HeroFloatCard top="38%" left="4%">
        <Text
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="32px"
          color="brand.lime"
          lineHeight={1}
        >
          100%
        </Text>
        <Text
          fontFamily="'DM Sans', sans-serif"
          fontSize="12px"
          color="rgba(255,255,255,0.4)"
          mt={1}
        >
          Bias eliminated
        </Text>
      </HeroFloatCard>

      <HeroFloatCard top="36%" right="4%">
        <Text
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="32px"
          color="#7C3AED"
          lineHeight={1}
        >
          3.2×
        </Text>
        <Text
          fontFamily="'DM Sans', sans-serif"
          fontSize="12px"
          color="rgba(255,255,255,0.4)"
          mt={1}
        >
          Better hire accuracy
        </Text>
      </HeroFloatCard>

      <HeroFloatCard bottom="18%" left="6%">
        <HStack spacing={2}>
          <Icon as={ShieldCheckIcon} color="brand.lime" w={4} h={4} />
          <Text
            fontFamily="'Space Mono', monospace"
            fontSize="11px"
            color="rgba(255,255,255,0.55)"
          >
            Identity: HASHED
          </Text>
        </HStack>
      </HeroFloatCard>

      <HeroFloatCard bottom="20%" right="5%">
        <HStack spacing={2}>
          <Icon as={CheckBadgeIcon} color="#7C3AED" w={4} h={4} />
          <Text
            fontFamily="'Space Mono', monospace"
            fontSize="11px"
            color="rgba(255,255,255,0.55)"
          >
            Score: 94 / 100
          </Text>
        </HStack>
      </HeroFloatCard>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MARQUEE
// ─────────────────────────────────────────────────────────────────────────────
function LogoMarquee() {
  const cos = [
    'Google',
    'Meta',
    'Stripe',
    'Notion',
    'Linear',
    'Figma',
    'Vercel',
    'Shopify',
    'Airbnb',
    'Discord',
    'Slack',
    'GitHub',
    'Atlassian',
    'Twilio',
  ];
  return (
    <Box
      overflow="hidden"
      py={10}
      borderTop="1px solid rgba(255,255,255,0.05)"
      borderBottom="1px solid rgba(255,255,255,0.05)"
      bg="rgba(255,255,255,0.01)"
    >
      <Flex className="marquee-track">
        {[...cos, ...cos].map((n, i) => (
          <HStack key={i} spacing={3} px={10} flexShrink={0}>
            <Box
              w="5px"
              h="5px"
              borderRadius="full"
              bg="rgba(255,255,255,0.13)"
            />
            <Text
              fontFamily="'Syne', sans-serif"
              fontWeight={600}
              fontSize="14px"
              color="rgba(255,255,255,0.22)"
              textTransform="uppercase"
              letterSpacing=".06em"
              whiteSpace="nowrap"
            >
              {n}
            </Text>
          </HStack>
        ))}
      </Flex>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PROBLEM SECTION
// ─────────────────────────────────────────────────────────────────────────────
function Problem() {
  const problems = [
    {
      icon: XCircleIcon,
      title: 'College bias',
      stat: '78%',
      desc: 'of candidates filtered before any code is seen',
    },
    {
      icon: DocumentMagnifyingGlassIcon,
      title: 'Résumé theater',
      stat: 'r=0.27',
      desc: 'correlation between résumé & job performance',
    },
    {
      icon: ClockIcon,
      title: 'Time drain',
      stat: '23 hrs',
      desc: 'wasted per hire on manual screening on average',
    },
  ];

  return (
    <Box as="section" py={28} px={6} position="relative" overflow="hidden">
      {/* 🌌 Background */}
      <BackgroundBeams className="absolute inset-0 opacity-40" />

      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(to bottom, rgba(0,0,0,0.92), transparent, rgba(0,0,0,0.92))"
        pointerEvents="none"
      />

      <Container maxW="1200px" position="relative">
        {/* HEADER */}
        <Box mb={12}>
          <Text
            fontFamily="'Space Mono', monospace"
            fontSize="11px"
            color="#FF4D6D"
            letterSpacing=".12em"
            textTransform="uppercase"
            mb={5}
          >
            {'// The Problem'}
          </Text>

          <Heading
            fontFamily="'Syne', sans-serif"
            fontWeight={800}
            fontSize={{ base: '2.4rem', md: '3.6rem' }}
            color="white"
            mb={6}
          >
            Hiring is{' '}
            <Box
              as="span"
              fontFamily="'Instrument Serif', serif"
              fontStyle="italic"
              color="#FF4D6D"
            >
              broken
            </Box>{' '}
            by design.
          </Heading>

          <Text color="whiteAlpha.600" maxW="520px" lineHeight={1.8}>
            Companies filter by college names and previous employers before ever
            seeing a single line of code.
          </Text>
        </Box>

        {/* BENTO GRID */}
        <SimpleGrid columns={{ base: 1, md: 12 }} spacing={6}>
          <GridItem
            area="md:col-span-6"
            icon={<XCircleIcon className="h-4 w-4 text-[#FF4D6D]" />}
            title="College bias"
            stat="78%"
            description="of candidates filtered before any code is seen"
          />

          <GridItem
            area="md:col-span-6"
            icon={
              <DocumentMagnifyingGlassIcon className="h-4 w-4 text-[#FF4D6D]" />
            }
            title="Résumé theater"
            stat="r=0.27"
            description="correlation between résumé & job performance"
          />

          <GridItem
            area="md:col-span-12"
            icon={<ClockIcon className="h-4 w-4 text-[#FF4D6D]" />}
            title="Time drain"
            stat="23 hrs"
            description="wasted per hire on manual screening on average"
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

/* ========================= */
/* FIXED GRID ITEM (IMPORTANT) */
/* ========================= */

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat: string;
  area: string;
}

const GridItem = ({ icon, title, description, stat, area }: GridItemProps) => {
  return (
    <Box
      className={area}
      position="relative"
      borderRadius="20px"
      bg="#0F0F14"
      border="1px solid rgba(255,255,255,0.08)"
      minH="180px"
      overflow="visible" // 🔥 IMPORTANT FIX
    >
      {/* 🔥 GLOW MUST BE FIRST CHILD */}
      <GlowingEffect
        blur={0}
        borderWidth={3}
        spread={90}
        glow={true}
        disabled={false}
        proximity={120}
        inactiveZone={0.01}
      />

      {/* glow blob */}
      <Box
        position="absolute"
        top="-40px"
        right="-40px"
        w="160px"
        h="160px"
        bg="#FF4D6D"
        opacity={0.12}
        filter="blur(50px)"
        borderRadius="full"
      />

      {/* watermark */}
      <Box
        position="absolute"
        bottom="-10px"
        right="-10px"
        fontSize="90px"
        fontWeight="black"
        color="whiteAlpha.100"
        userSelect="none"
      >
        {stat}
      </Box>

      {/* CONTENT */}
      <Box
        position="relative"
        zIndex={10}
        p={6}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        h="100%"
      >
        <HStack spacing={3} mb={4}>
          <Box p={2} bg="whiteAlpha.100" borderRadius="10px">
            {icon}
          </Box>

          <Text fontWeight={600} color="white">
            {title}
          </Text>
        </HStack>

        <Text fontSize="14px" color="whiteAlpha.600" lineHeight={1.6}>
          {description}
        </Text>
      </Box>
    </Box>
  );
};
// ─────────────────────────────────────────────────────────────────────────────
// 8. HOW IT WORKS
// ─────────────────────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: CodeBracketIcon,
      color: '#C8F135',
      title: 'Solve Real Problems',
      desc: 'Adaptive system adjusts difficulty in real time.',
      tags: ['Adaptive Difficulty', 'Real-world code'],
    },
    {
      num: '02',
      icon: SparklesIcon,
      color: '#7C3AED',
      title: 'AI Thinks With You',
      desc: 'Tracks reasoning, not just output.',
      tags: ['LangGraph AI', 'Ghost Replay'],
    },
    {
      num: '03',
      icon: EyeSlashIcon,
      color: '#FF4D6D',
      title: 'Blind Evaluation',
      desc: 'No identity. Only logic is evaluated.',
      tags: ['Zero Bias', 'Hidden Identity'],
    },
    {
      num: '04',
      icon: TrophyIcon,
      color: '#F59E0B',
      title: 'Merit Unlock',
      desc: 'Best engineers rise purely by skill.',
      tags: ['Ranking', 'Threshold Unlock'],
    },
  ];

  return (
    <Box as="section" py={40} position="relative" bg="black" overflow="hidden">
      {/* BACKGROUND */}
      <Box position="absolute" inset={0} opacity={0.9}>
        <Spotlight />
        <AnimatedGridPattern
          numSquares={60}
          maxOpacity={0.08}
          duration={3}
          repeatDelay={1}
          className="absolute inset-0 w-full h-full"
        />
      </Box>

      <Container maxW="900px" position="relative" zIndex={1}>
        {/* HEADER */}
        <Box textAlign="center" mb={20}>
          <Text color="#C8F135" fontSize="12px" letterSpacing="0.3em">
            {'// HOW IT WORKS'}
          </Text>
          <Heading color="white" fontSize={{ base: '2xl', md: '4xl' }}>
            Step-by-step evaluation system
          </Heading>
        </Box>

        {/* ================= TIMELINE ================= */}
        <Box position="relative">
          {/* vertical line */}
          <Box
            position="absolute"
            left="18px"
            top={0}
            bottom={0}
            width="2px"
            bg="rgba(200,241,53,0.3)"
          />

          <VStack spacing={16} align="stretch">
            {steps.map((step, i) => (
              <Box key={i} position="relative" pl={12}>
                {/* DOT */}
                <Box
                  position="absolute"
                  left="10px"
                  top="6px"
                  w="14px"
                  h="14px"
                  borderRadius="full"
                  bg={step.color}
                  boxShadow={`0 0 20px ${step.color}`}
                />

                {/* CONTENT CARD */}
                <Box
                  bg="#16161E"
                  border="1px solid rgba(255,255,255,0.06)"
                  borderRadius="16px"
                  p={6}
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: `0 0 40px ${step.color}33`,
                  }}
                  transition="0.3s"
                >
                  <HStack spacing={3} mb={3}>
                    <Icon as={step.icon} color={step.color} w={5} h={5} />
                    <Text color="white" fontWeight="600">
                      {step.title}
                    </Text>
                  </HStack>

                  <Text color="whiteAlpha.700" fontSize="14px" mb={4}>
                    {step.desc}
                  </Text>

                  <HStack spacing={2} wrap="wrap">
                    {step.tags.map((t) => (
                      <Tag
                        key={t}
                        bg="rgba(255,255,255,0.05)"
                        color="whiteAlpha.600"
                        fontSize="10px"
                      >
                        {t}
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              </Box>
            ))}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// 9. AI FEATURE SPOTLIGHT — Ghost Replay
// ─────────────────────────────────────────────────────────────────────────────
const GHOST_REPLAY_TIMELINE = [
  {
    t: '0:00',
    event: 'Challenge loaded',
    code: 'function twoSum(nums, target) {',
    type: 'start',
  },
  {
    t: '0:42',
    event: 'Brute-force attempt',
    code: '// O(n²) nested loop',
    type: 'attempt',
  },
  {
    t: '1:15',
    event: 'AI Hint injected',
    code: '💡 Try hash map optimization',
    type: 'hint',
  },
  {
    t: '2:03',
    event: 'Strategy pivot',
    code: 'const map = new Map();',
    type: 'pivot',
  },
  {
    t: '3:28',
    event: 'Optimal solution',
    code: '// ✓ O(n) accepted',
    type: 'success',
  },
] as const;

function GhostReplay() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(
      () => setActive((a) => (a + 1) % GHOST_REPLAY_TIMELINE.length),
      1800
    );
    return () => clearInterval(t);
  }, []);

  if (!mounted) return null;

  return (
    <Box bg="black" w="100%" overflow="hidden">
      <ContainerScroll
        titleComponent={
          <Box
            w="100%"
            minH={{ base: '60vh', md: '80vh' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={{ base: 4, md: 10 }}
            py={{ base: 12, md: 20 }}
          >
            <Box position="absolute" inset={0} zIndex={0}>
              <Meteors number={25} />
            </Box>{' '}
            <Box position="absolute" inset={0} zIndex={0}>
              <Meteors number={25} />
            </Box>
            <Box
              w="100%"
              maxW="6xl"
              textAlign="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={{ base: 4, md: 6 }}
            >
              <Text color="#8ccbff" fontSize="12px" letterSpacing="0.3em">
                {'// HOW IT WORKS'}
              </Text>
              {/* TITLE */}
              <Heading
                as="h2"
                fontWeight="bold"
                letterSpacing="-0.02em"
                color="gray.500"
                fontSize={{
                  base: '3xl',
                  sm: '4xl',
                  md: '5xl',
                  lg: '6xl',
                  xl: '7xl',
                }}
                lineHeight="1.1"
              >
                Ghost Replay
              </Heading>

              {/* CANVAS TEXT (REAL RESPONSIVE FIX) */}
              <Box w="100%" maxW="1400px" transform="scale(1.1)">
                <CanvasText
                  text="How you think, not just what you write"
                  backgroundClassName="bg-blue-600 dark:bg-blue-700"
                  colors={[
                    'rgba(0, 153, 255, 1)',
                    'rgba(0, 153, 255, 0.9)',
                    'rgba(0, 153, 255, 0.8)',
                    'rgba(0, 153, 255, 0.7)',
                    'rgba(0, 153, 255, 0.6)',
                    'rgba(0, 153, 255, 0.5)',
                    'rgba(0, 153, 255, 0.4)',
                    'rgba(0, 153, 255, 0.3)',
                    'rgba(0, 153, 255, 0.2)',
                    'rgba(0, 153, 255, 0.1)',
                  ]}
                  lineGap={8}
                  animationDuration={20}
                />
              </Box>
            </Box>
          </Box>
        }
      >
        {/* PANEL */}
        <Box
          bg="#0F0F14"
          border="1px solid rgba(255,255,255,0.08)"
          borderRadius={{ base: '14px', md: '24px' }}
          p={{ base: 4, md: 6 }}
          w="100%"
          maxW="100%"
        >
          {/* TOP BAR */}
          <HStack justify="space-between" mb={6}>
            <HStack spacing={2}>
              <Box w="10px" h="10px" borderRadius="full" bg="#FF5F57" />
              <Box w="10px" h="10px" borderRadius="full" bg="#FEBC2E" />
              <Box w="10px" h="10px" borderRadius="full" bg="#28C840" />
            </HStack>

            <Text
              fontFamily="'Space Mono', monospace"
              fontSize="11px"
              color="whiteAlpha.400"
            >
              cognition.trace
            </Text>
          </HStack>

          {/* TIMELINE */}
          <VStack spacing={3} align="stretch">
            {GHOST_REPLAY_TIMELINE.map((item, i) => (
              <Box
                key={i}
                p={{ base: 3, md: 4 }}
                borderRadius="12px"
                transition="all 0.25s ease"
                bg={active === i ? 'rgba(124,58,237,0.12)' : 'transparent'}
                border={
                  active === i
                    ? '1px solid rgba(124,58,237,0.35)'
                    : '1px solid transparent'
                }
              >
                <HStack spacing={3} flexWrap="wrap" mb={1}>
                  <Text
                    fontSize="10px"
                    fontFamily="'Space Mono', monospace"
                    color="whiteAlpha.500"
                  >
                    {item.t}
                  </Text>

                  <Text
                    fontSize="13px"
                    color={active === i ? '#C8F135' : 'whiteAlpha.700'}
                  >
                    {item.event}
                  </Text>
                </HStack>

                <Text
                  fontSize="12px"
                  fontFamily="'Space Mono', monospace"
                  color={
                    item.type === 'hint'
                      ? '#C8F135'
                      : item.type === 'success'
                        ? '#4ADE80'
                        : 'whiteAlpha.600'
                  }
                  pl={6}
                >
                  {item.code}
                </Text>
              </Box>
            ))}
          </VStack>

          {/* SCORE */}
          <Box mt={6} pt={5} borderTop="1px solid rgba(255,255,255,0.06)">
            <HStack justify="space-between" flexWrap="wrap">
              <Text
                fontSize="11px"
                fontFamily="'Space Mono', monospace"
                color="whiteAlpha.400"
              >
                PERFORMANCE SCORE
              </Text>

              <Text
                fontSize="22px"
                color="#C8F135"
                fontFamily="'Bebas Neue', sans-serif"
              >
                94 / 100
              </Text>
            </HStack>

            <Box mt={2} h="4px" bg="whiteAlpha.100" borderRadius="full">
              <Box
                w="94%"
                h="100%"
                bgGradient="linear(to-r, #C8F135, #7C3AED)"
                borderRadius="full"
              />
            </Box>
          </Box>
        </Box>
      </ContainerScroll>
    </Box>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// 10. FEATURES GRID
// ─────────────────────────────────────────────────────────────────────────────
function FeaturesBento() {
  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      py={{ base: '6rem', md: '10rem' }}
      px={{ base: '1rem', sm: '1.5rem', md: '2rem', lg: '3rem' }}
      borderTop="1px solid rgba(255,255,255,0.1)"
      borderBottom="1px solid rgba(255,255,255,0.1)"
      bg="#000"
      width="100%"
    >
      {/* 🔥 FULL SECTION BACKGROUND LAYER */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        pointerEvents="none"
        width="100%"
        height="100%"
      >
        <BackgroundLines className="w-full h-full opacity-80 scale-110" />
        <BackgroundLines className="w-full h-full opacity-80 scale-110" />
        <BackgroundLines className="w-full h-full opacity-80 scale-110" />
        <BackgroundLines className="w-full h-full opacity-80 scale-110" />
        <BackgroundLines className="w-full h-full opacity-80 scale-110" />
      </Box>

      {/* optional dark overlay for depth */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        bg="radial-gradient(circle at center, rgba(0,0,0,0.2), rgba(0,0,0,0.9))"
        pointerEvents="none"
        width="100%"
        height="100%"
      />

      {/* CONTENT */}
      <Box position="relative" zIndex={1} width="100%">
        {/* HEADER */}
        <Box
          maxW="70rem"
          mx="auto"
          textAlign="center"
          mb={{ base: '3rem', md: '5rem' }}
          px={{ base: '1rem', sm: '2rem', md: '0' }}
        >
          {/* Subtitle */}
          <Box
            as="p"
            fontSize="0.75rem"
            letterSpacing="0.25em"
            textTransform="uppercase"
            color="#A3E635"
            mb="1rem"
            fontFamily="DM Sans, sans-serif"
          >
            {'// Key Differentiators'}
          </Box>

          {/* HEADING (smaller + cleaner scale) */}
          <Box
            as="h2"
            fontSize={{
              base: '2rem',
              sm: '2.5rem',
              md: '3.5rem',
              lg: '4.5rem',
            }}
            fontWeight={750}
            letterSpacing="-0.02em"
            lineHeight={1.1}
            color="white"
            fontFamily="Syne, sans-serif"
          >
            Not just a platform.
            <br />
            <Box
              as="span"
              fontStyle="italic"
              fontFamily="Instrument Serif, serif"
              color="#A3E635"
            >
              A fair future for hiring.
            </Box>
          </Box>
        </Box>

        {/* BENTO GRID */}
        <Box width="100%">
          <BentoDemo />
        </Box>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. RECRUITER SECTION
// ─────────────────────────────────────────────────────────────────────────────
type Candidate = {
  rank: number;
  score: number;
  skills: string[];
  status: string;
  time: string;
};
function Dashboard({ candidates }: { candidates: Candidate[] }) {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      borderRadius={{ base: '16px', md: '24px' }}
      overflow="hidden"
      bg="rgba(255,255,255,0.03)"
      border="1px solid rgba(255,255,255,0.08)"
      backdropFilter="blur(18px)"
      position="relative"
      width="100%"
    >
      {/* glow */}
      <Box
        position="absolute"
        inset={0}
        bg="radial-gradient(circle at top, rgba(200,241,53,0.08), transparent 60%)"
      />

      {/* HEADER */}
      <HStack
        px={{ base: 3, sm: 4, md: 5 }}
        py={{ base: 3, md: 4 }}
        borderBottom="1px solid rgba(255,255,255,0.06)"
        justify="space-between"
        position="relative"
        flexWrap="wrap"
        gap={2}
      >
        <HStack>
          <Icon as={UserGroupIcon} w={4} h={4} color="whiteAlpha.600" />
          <Text fontSize={{ base: '12px', md: '14px' }}>
            Candidate Rankings
          </Text>
        </HStack>

        <Tag
          bg="rgba(200,241,53,0.1)"
          color="#C8F135"
          size={{ base: 'sm', md: 'md' }}
        >
          LIVE
        </Tag>
      </HStack>

      {/* ROWS - Responsive grid/card layout on mobile */}
      <Box>
        {candidates.map((c, i) => (
          <Box
            key={i}
            px={{ base: 3, sm: 4, md: 5 }}
            py={{ base: 3, md: 3 }}
            borderBottom="1px solid rgba(255,255,255,0.05)"
            _hover={{ bg: 'rgba(255,255,255,0.02)' }}
            position="relative"
          >
            {/* Desktop: Horizontal row */}
            <HStack
              display={{ base: 'none', md: 'flex' }}
              justify="space-between"
              w="100%"
            >
              <Text color="whiteAlpha.600" minW="40px">
                #{c.rank}
              </Text>

              <HStack flex="1" justify="flex-start" pl={4}>
                {c.skills.map((s) => (
                  <Tag key={s} size="sm" bg="whiteAlpha.100">
                    {s}
                  </Tag>
                ))}
              </HStack>

              <Text
                color={c.score > 90 ? '#4ADE80' : '#F59E0B'}
                fontWeight="medium"
                minW="45px"
                textAlign="right"
              >
                {c.score}
              </Text>

              <Text fontSize="12px" color="whiteAlpha.500" minW="50px">
                {c.time}
              </Text>

              <Tag
                bg={
                  c.status === 'Revealed' ? 'green.500Alpha' : 'whiteAlpha.200'
                }
                size="sm"
              >
                {c.status}
              </Tag>
            </HStack>

            {/* Mobile: Card layout */}
            <Box display={{ base: 'block', md: 'none' }}>
              <HStack justify="space-between" mb={2}>
                <Text color="whiteAlpha.600" fontWeight="bold">
                  #{c.rank}
                </Text>
                <Tag
                  bg={
                    c.status === 'Revealed'
                      ? 'green.500Alpha'
                      : 'whiteAlpha.200'
                  }
                  size="sm"
                >
                  {c.status}
                </Tag>
              </HStack>

              <HStack flexWrap="wrap" gap={2} mb={2}>
                {c.skills.map((s) => (
                  <Tag key={s} size="sm" bg="whiteAlpha.100">
                    {s}
                  </Tag>
                ))}
              </HStack>

              <HStack justify="space-between">
                <Text
                  color={c.score > 90 ? '#4ADE80' : '#F59E0B'}
                  fontWeight="bold"
                >
                  Score: {c.score}
                </Text>
                <Text fontSize="11px" color="whiteAlpha.500">
                  Time: {c.time}
                </Text>
              </HStack>
            </Box>
          </Box>
        ))}
      </Box>
    </MotionBox>
  );
}

/* ---------------- MAIN ---------------- */
function RecruiterSection() {
  const candidates = [
    {
      rank: 1,
      score: 97,
      skills: ['DP', 'Graphs'],
      status: 'Revealed',
      time: '28m',
    },
    {
      rank: 2,
      score: 91,
      skills: ['Hash Maps', 'BFS'],
      status: 'Revealed',
      time: '35m',
    },
    {
      rank: 3,
      score: 86,
      skills: ['Trees', 'Recursion'],
      status: 'Hidden',
      time: '42m',
    },
    {
      rank: 4,
      score: 78,
      skills: ['Arrays', 'Sorting'],
      status: 'Hidden',
      time: '51m',
    },
  ];

  return (
    <Box
      as="section"
      position="relative"
      py={{ base: 16, sm: 20, md: 28, lg: 32 }}
      px={{ base: 3, sm: 4, md: 6, lg: 8 }}
      overflow="hidden"
      bg="black"
    >
      {/* ================= SPOTLIGHT LAYER (MAIN FOCUS) ================= */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        opacity={1}
        filter="brightness(1.3) contrast(1.2)"
      >
        <Spotlight />
      </Box>

      {/* ================= GRID BACKGROUND ================= */}
      <Box
        position="absolute"
        inset={0}
        transform={{ base: 'skewY(6deg)', md: 'skewY(12deg)' }}
        opacity={0.35}
      >
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.15}
          duration={3}
          repeatDelay={1}
          className="absolute inset-0 w-full h-full"
        />
      </Box>

      {/* ================= FLICKER LAYER ================= */}
      <Box position="absolute" inset={0} zIndex={0} opacity={0.15}>
        <FlickeringGrid className="w-full h-full" />
      </Box>

      {/* ================= DARK GRADIENT DEPTH ================= */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        bg="radial-gradient(circle at top, rgba(200,241,53,0.08), transparent 60%)"
      />

      {/* ================= CONTENT ================= */}
      <Container
        maxW="1280px"
        position="relative"
        zIndex={1}
        px={{ base: 0, sm: 2, md: 4 }}
      >
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={{ base: 8, md: 12, lg: 16 }}
          alignItems="center"
        >
          {/* LEFT - Dashboard */}
          <Dashboard candidates={candidates} />

          {/* RIGHT - Content */}
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Text
              color="#C8F135"
              fontSize={{ base: '10px', sm: '11px', md: '12px' }}
              mb={{ base: 3, md: 4 }}
              letterSpacing="0.05em"
            >
              {'// For Recruiters'}
            </Text>

            <Text
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="bold"
              color="white"
              mb={{ base: 3, md: 4 }}
              lineHeight={{ base: 1.3, md: 1.2 }}
            >
              See ability, not background.
            </Text>

            <Text
              color="whiteAlpha.700"
              mb={{ base: 6, md: 8 }}
              fontSize={{ base: 'sm', md: 'md' }}
            >
              Spotlight-driven UI highlights top candidates and removes bias.
            </Text>

            <VStack
              align="start"
              spacing={{ base: 2.5, md: 3 }}
              mb={{ base: 6, md: 8, lg: 10 }}
            >
              {[
                'Real-time ranked candidate feed',
                'Watch full Ghost Replay sessions',
                'AI decision insights per candidate',
                'Identity revealed after merit threshold',
                'Zero manual screening',
              ].map((t) => (
                <HStack key={t} alignItems="flex-start">
                  <Icon
                    as={CheckCircleIcon}
                    color="#C8F135"
                    mt={0.5}
                    boxSize={{ base: 4, md: 5 }}
                  />
                  <Text
                    color="whiteAlpha.700"
                    fontSize={{ base: '13px', sm: '14px', md: '15px' }}
                  >
                    {t}
                  </Text>
                </HStack>
              ))}
            </VStack>

            <Button
              bg="#C8F135"
              color="black"
              _hover={{ bg: '#d4ff4a' }}
              rightIcon={<ArrowRightIcon width={16} />}
              size={{ base: 'sm', sm: 'md', md: 'lg' }}
              px={{ base: 4, md: 6 }}
              py={{ base: 5, md: 6 }}
              fontSize={{ base: '13px', md: '14px' }}
            >
              Book Demo
            </Button>
          </MotionBox>
        </Grid>
      </Container>
    </Box>
  );
}
type Stat = {
  num: string;
  label: string;
  color: string;
};
// ─────────────────────────────────────────────────────────────────────────────
// 12. STATS ROW
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ stat, index }: { stat: Stat; index: number }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{ y: -6, scale: 1.04 }}
      textAlign="center"
      p={{ base: 4, md: 6 }}
      borderRadius={{ base: '16px', md: '18px' }}
      position="relative"
      overflow="hidden"
      bg="rgba(255,255,255,0.03)"
      border="1px solid rgba(255,255,255,0.08)"
      backdropFilter="blur(14px)"
      _hover={{
        borderColor: stat.color,
        boxShadow: `0 0 40px ${stat.color}30`,
      }}
    >
      {/* Glow layer */}
      <Box
        position="absolute"
        inset={0}
        bg={`radial-gradient(circle at center, ${stat.color}18, transparent 70%)`}
        pointerEvents="none"
      />

      {/* Number */}
      <Text
        position="relative"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={{ base: '2.5rem', sm: '3rem', md: '4.5rem' }}
        color={stat.color}
        lineHeight={1}
        letterSpacing="-0.02em"
        mb={{ base: 1, md: 2 }}
        textShadow={`0 0 25px ${stat.color}55`}
      >
        {stat.num}
      </Text>

      {/* Label */}
      <Text
        position="relative"
        fontFamily="'DM Sans', sans-serif"
        fontSize={{ base: '12px', md: '14px' }}
        fontWeight={300}
        color="rgba(255,255,255,0.5)"
      >
        {stat.label}
      </Text>
    </MotionBox>
  );
}

// ===============================
// 🔥 MAIN STATS SECTION
// ===============================
function StatsRow() {
  const stats: Stat[] = [
    { num: '2,400+', label: 'Devs already solving', color: '#C8F135' },
    { num: '3.2×', label: 'Better hire quality', color: '#7C3AED' },
    { num: '0%', label: 'Bias in evaluation', color: '#4ADE80' },
    { num: '23h', label: 'Avg time saved per hire', color: '#F59E0B' },
  ];

  return (
    <Box
      as="section"
      position="relative"
      py={{ base: 16, md: 24 }}
      px={{ base: 4, md: 6 }}
      overflow="hidden"
      bg="black"
      borderTop="1px solid rgba(255,255,255,0.05)"
      borderBottom="1px solid rgba(255,255,255,0.05)"
    >
      {/* ======================================
          🔥 BACKGROUND LAYER (FIXED VISIBILITY)
      ====================================== */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          'absolute inset-0 w-full h-full',
          'mask-[radial-gradient(500px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
        )}
      />

      {/* ======================================
          🔥 GLOW OVERLAY (DEPTH EFFECT)
      ====================================== */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        pointerEvents="none"
        bg="radial-gradient(circle at top, rgba(200,241,53,0.10), transparent 60%)"
      />

      {/* ======================================
          🔥 CONTENT
      ====================================== */}
      <Container maxW="1280px" position="relative" zIndex={1}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          spacing={{ base: 6, md: 10 }}
        >
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// 13. TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: 'Arjun M.',
    username: 'Backend Eng → Series B startup',
    body: 'I got interviews at three top-tier companies after years of being filtered out by ATS. SkillProof let my code speak.',
    img: 'https://avatar.vercel.sh/arjun',
  },
  {
    name: 'Sarah K.',
    username: 'Engineering Manager @ Fintech',
    body: 'We cut screening time from 3 weeks to 4 days. The Ghost Replay alone is worth it — you actually see how engineers think.',
    img: 'https://avatar.vercel.sh/sarah',
  },
  {
    name: 'Chen W.',
    username: 'Fullstack Dev → Seed startup',
    body: "I never went to a top school. But my score was #1 in the cohort. That's a feeling I can't describe.",
    img: 'https://avatar.vercel.sh/chen',
  },
  {
    name: 'Rohit S.',
    username: 'Frontend Dev → Google',
    body: 'Finally a platform where my skills mattered more than my resume. Got shortlisted instantly.',
    img: 'https://avatar.vercel.sh/rohit',
  },
  {
    name: 'Ayesha P.',
    username: 'SWE → Amazon',
    body: 'The AI mentor actually improved how I think about problems. This is next level.',
    img: 'https://avatar.vercel.sh/ayesha',
  },
  {
    name: 'Daniel T.',
    username: 'ML Engineer → Stripe',
    body: 'Ghost Replay is insane. Recruiters finally see how I solve problems, not just results.',
    img: 'https://avatar.vercel.sh/daniel',
  },
];

const firstRow = testimonials.slice(0, 3);
const secondRow = testimonials.slice(3, 6);

const TestimonialCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        'relative h-full w-80 cursor-pointer overflow-hidden rounded-2xl border p-5',
        'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]',
        'transition-all'
      )}
    >
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="rounded-full"
          width="40"
          height="40"
          alt={name}
          src={img}
        />
        <div>
          <figcaption className="text-sm font-semibold text-white">
            {name}
          </figcaption>
          <p className="text-xs text-white/40">{username}</p>
        </div>
      </div>

      <blockquote className="mt-4 text-sm text-white/70 leading-relaxed">
        “{body}”
      </blockquote>
    </figure>
  );
};

function Testimonials() {
  return (
    <section
      style={{
        paddingTop: '12rem',
        paddingBottom: '12rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        backgroundColor: 'black',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <p
          style={{
            fontSize: '1.25rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#A3E635',
            marginBottom: '1.5rem',
            fontWeight: 500,
          }}
        >
          {'// Testimonials'}
        </p>

        <h2
          style={{
            fontSize: 'clamp(3.5rem, 6vw, 6.5rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1,
          }}
        >
          Real people.{' '}
          <span
            style={{
              fontStyle: 'italic',
              color: '#A3E635',
              fontFamily: 'serif',
            }}
          >
            Real results.
          </span>
        </h2>
      </div>

      {/* Marquee */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:25s]">
          {firstRow.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover className="[--duration:25s]">
          {secondRow.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </Marquee>

        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black" />
      </div>
    </section>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// 14. PRICING
// ─────────────────────────────────────────────────────────────────────────────

function Pricing() {
  const plans = [
    {
      name: 'Developer',
      price: 'Free',
      period: '',
      desc: 'For individual developers building their profile.',
      features: [
        'Unlimited challenge attempts',
        'AI mentor (basic hints)',
        'Ghost Replay viewer',
        'Merit score + badge',
        'Community leaderboard',
      ],
      cta: 'Start Solving',
      highlight: false,
      icon: Sparkles,
    },
    {
      name: 'Recruiter',
      price: '$299',
      period: '/month',
      desc: 'For hiring teams serious about skill-based hiring.',
      features: [
        'Unlimited candidate evaluations',
        'Full Ghost Replay for every session',
        'AI decision insights',
        'Blind ranking dashboard',
        'ATS integration',
        'Dedicated success manager',
      ],
      cta: 'Start Hiring',
      highlight: true,
      icon: Zap,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For large orgs with custom workflows.',
      features: [
        'Everything in Recruiter',
        'Custom challenge library',
        'SSO + SAML',
        'SOC 2 Type II compliant',
        'SLA + dedicated infra',
        'White-label option',
      ],
      cta: 'Contact Us',
      highlight: false,
      icon: Crown,
    },
  ];

  return (
    <Box bg="#050507" color="white" minH="100vh" py={24} px={6}>
      <Container maxW="1200px">
        {/* HEADER */}
        <Box textAlign="center" mb={14}>
          <Text
            fontSize="11px"
            letterSpacing=".12em"
            color="brand.lime"
            textTransform="uppercase"
            mb={3}
          >
            {'// Pricing'}
          </Text>

          <Heading fontSize={{ base: '1.8rem', md: '2.8rem' }}>
            Simple pricing{' '}
            <AuroraText colors={['#C8F135', '#7C3AED']}>
              No surprises.
            </AuroraText>
          </Heading>
        </Box>

        {/* CARDS */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {plans.map((p, i) => (
            <MagicCard
              key={i}
              className="
                p-6 h-full relative text-white
                bg-[#0A0A0F]
                border border-white/10
                transition-all duration-300
                hover:border-white/30
                hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]
              "
              // ✅ DARK DEFAULT
              gradientColor="#1a1a1a"
            >
              {/* POPULAR */}
              {p.highlight && (
                <Box
                  position="absolute"
                  top={-10}
                  left="50%"
                  transform="translateX(-50%)"
                  bg="brand.lime"
                  color="black"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="10px"
                >
                  POPULAR
                </Box>
              )}

              {/* ICON */}
              <Box mb={4}>
                <Box
                  w={10}
                  h={10}
                  borderRadius="xl"
                  bg="whiteAlpha.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <p.icon size={18} />
                </Box>
              </Box>

              {/* NAME */}
              <Text fontSize="18px" mb={2}>
                {p.name}
              </Text>

              {/* PRICE */}
              <HStack align="baseline" mb={3}>
                <Text fontSize="40px" fontWeight="bold">
                  {p.price}
                </Text>
                <Text opacity={0.5}>{p.period}</Text>
              </HStack>

              {/* DESC */}
              <Text fontSize="13px" opacity={0.6} mb={6}>
                {p.desc}
              </Text>

              {/* CTA */}
              <Button
                w="full"
                mb={6}
                bg={p.highlight ? 'brand.lime' : 'whiteAlpha.100'}
                color={p.highlight ? 'black' : 'white'}
                _hover={{
                  bg: p.highlight ? 'brand.lime' : 'whiteAlpha.200',
                  transform: 'scale(1.02)',
                }}
              >
                {p.cta}
              </Button>

              <Divider borderColor="whiteAlpha.200" mb={5} />

              {/* FEATURES */}
              <VStack align="start" spacing={2}>
                {p.features.map((f, j) => (
                  <Text key={j} fontSize="12px" opacity={0.7}>
                    • {f}
                  </Text>
                ))}
              </VStack>
            </MagicCard>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// 15. CTA SECTION
// ─────────────────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <Box position="relative" overflow="hidden">
      {/* Noise Texture Background */}
      <Box position="absolute" inset={0} pointerEvents="none" zIndex={0}>
        <NoiseTexture opacity={0.08} />
      </Box>

      {/* Content */}
      <Box position="relative" zIndex={1} py={12} px={4}>
        <Box maxW="700px" mx="auto" textAlign="center">
          <Text
            fontFamily="'Space Mono', monospace"
            fontSize="10px"
            letterSpacing=".14em"
            color="brand.lime"
            textTransform="uppercase"
            mb={2}
          >
            {'// Ready to Prove Yourself?'}
          </Text>

          <Heading
            fontFamily="'Bebas Neue', sans-serif"
            fontWeight={400}
            fontSize={{ base: '2rem', md: '2.5rem' }}
            lineHeight={1.2}
            mb={3}
          >
            YOUR CODE.{' '}
            <AuroraText
              colors={['#C8F135', '#7C3AED', '#FF4D6D', '#C8F135']}
              speed={0.8}
              className="font-['Bebas_Neue']"
            >
              YOUR CAREER.
            </AuroraText>
          </Heading>

          <Text
            fontFamily="'Instrument Serif', serif"
            fontStyle="italic"
            fontSize="0.9rem"
            color="rgba(255,255,255,0.5)"
            mb={5}
          >
            LeetCode + AI mentor + hiring platform — no résumés.
          </Text>

          <HStack spacing={3} justify="center">
            <ShimmerButton
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                borderRadius: '8px',
              }}
            >
              Start Solving
            </ShimmerButton>

            <Box
              as="button"
              px={4}
              py={2}
              fontSize="13px"
              border="1px solid rgba(255,255,255,0.2)"
              borderRadius="8px"
              color="white"
              _hover={{
                borderColor: 'brand.lime',
                color: 'brand.lime',
              }}
            >
              Book Demo
            </Box>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// 16. FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <Box
      as="footer"
      position="relative"
      overflow="hidden"
      borderTop="1px solid rgba(255,255,255,0.06)"
      py={16}
      px={6}
    >
      {/* 🔵 Background Layer */}
      <Box position="absolute" inset={0} zIndex={0}>
        <RetroGrid />
      </Box>

      {/* 🔵 Optional dark overlay (important for readability) */}
      <Box position="absolute" inset={0} bg="rgba(0,0,0,0.7)" zIndex={1} />

      {/* 🔵 Content Layer */}
      <Container position="relative" zIndex={2} maxW="1280px">
        <Grid
          templateColumns={{ base: '1fr', md: '2fr 1fr 1fr 1fr' }}
          gap={10}
          mb={12}
        >
          {/* Your existing content unchanged */}
          <Box>
            <HStack spacing={3} mb={4}>
              <Box
                w={8}
                h={8}
                bg="brand.lime"
                borderRadius={8}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={CpuChipIcon} color="brand.ink" w={5} h={5} />
              </Box>
              <Text
                fontFamily="'Cabinet Grotesk', sans-serif"
                fontWeight={900}
                fontSize="18px"
              >
                SkillProof
              </Text>
            </HStack>

            <Text
              fontSize="14px"
              color="rgba(255,255,255,0.38)"
              lineHeight={1.8}
              maxW="260px"
            >
              The platform that hires on skill, not résumés. Blind evaluation
              powered by AI.
            </Text>
          </Box>

          {[
            {
              title: 'Platform',
              links: ['How It Works', 'AI Mentor', 'Ghost Replay', 'Pricing'],
            },
            {
              title: 'Recruiters',
              links: [
                'Dashboard',
                'Candidate Ranking',
                'Integrations',
                'Enterprise',
              ],
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Privacy'],
            },
          ].map((col, i) => (
            <Box key={i}>
              <Text
                fontWeight={700}
                fontSize="13px"
                color="rgba(255,255,255,0.5)"
                textTransform="uppercase"
                mb={4}
              >
                {col.title}
              </Text>

              <VStack spacing={3} align="flex-start">
                {col.links.map((l) => (
                  <Text
                    key={l}
                    as="a"
                    href="#"
                    fontSize="14px"
                    color="rgba(255,255,255,0.38)"
                    _hover={{ color: '#fff' }}
                  >
                    {l}
                  </Text>
                ))}
              </VStack>
            </Box>
          ))}
        </Grid>

        <Divider borderColor="rgba(255,255,255,0.06)" mb={8} />

        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Text fontSize="11px" color="rgba(255,255,255,0.22)">
            © 2026 SkillProof Inc. All rights reserved.
          </Text>
          <Text fontSize="11px" color="rgba(255,255,255,0.22)">
            Built with ❤️ for engineers who deserve better.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 17. APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <GlobalCSS />
      <div className="grain-overlay" />
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <Problem />
        <HowItWorks />
        <GhostReplay />
        <FeaturesBento />
        <StatsRow />
        <RecruiterSection />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </ChakraProvider>
  );
}
