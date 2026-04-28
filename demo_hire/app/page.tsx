"use client";

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

   import React, { useState, useEffect, useRef, ReactNode } from "react";
import {
  Box, Flex, Grid, Text, Heading, Button, Badge,
  Container, Stack, HStack, VStack, Tag, Divider, Icon,
  useColorModeValue, ChakraProvider, extendTheme, Image,
  SimpleGrid, Circle, Square, AspectRatio,
  IconButton, chakra,
} from "@chakra-ui/react";
import {
  EyeSlashIcon, SparklesIcon, TrophyIcon, UserGroupIcon,
  CodeBracketIcon, BoltIcon, ShieldCheckIcon, ArrowRightIcon,
  PlayIcon, ChartBarIcon, LightBulbIcon, CpuChipIcon,
  CheckBadgeIcon, ArrowTrendingUpIcon, ClockIcon, XCircleIcon,
  BeakerIcon, StarIcon, RocketLaunchIcon, CursorArrowRaysIcon,
  DocumentMagnifyingGlassIcon, FingerPrintIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolid,
  StarIcon as StarSolid,
} from "@heroicons/react/24/solid";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import {RetroGrid} from "@/components/ui/retro-grid";
import {Spotlight} from "@/components/ui/spotlight-new";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BentoDemo} from "@/compo/demo";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { CheckCircleIcon, ChevronRight, Cpu, Crown, Menu, Sparkles, X, Zap } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import CTA from "@/compo/cta";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { WarpBackground } from "@/components/ui/warp-background";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { AuroraText } from "@/components/ui/aurora-text";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Globe } from "@/components/ui/globe";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

const cn = (...args: Array<string | false | null | undefined>) =>
  args.filter(Boolean).join(" ");

const features = [
  {
    Icon: SparklesIcon,
    name: "AI Mentor",
    description:
      "LangGraph-powered hints that adapt to your exact approach — not generic suggestions.",
    href: "#",
    cta: "Try AI Mentor",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 via-transparent to-transparent" />
    ),
  },
  {
    Icon: EyeSlashIcon,
    name: "Blind Hiring",
    description:
      "Cryptographic identity hashing hides name, college, and company until merit threshold is crossed.",
    href: "#",
    cta: "Explore Blind Mode",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
    ),
  },
  {
    Icon: CursorArrowRaysIcon,
    name: "Ghost Replay",
    description:
      "Full thinking timeline — recruiters see how you solved, not just final answers.",
    href: "#",
    cta: "Watch Replay",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent" />
    ),
  },
  {
    Icon: FingerPrintIcon,
    name: "Merit Scoring",
    description:
      "Multi-dimensional scoring: correctness, efficiency, readability, and reasoning quality.",
    href: "#",
    cta: "View Score Model",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
    ),
  },
]


// ─────────────────────────────────────────────────────────────────────────────
// 1. THEME
// ─────────────────────────────────────────────────────────────────────────────
const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  colors: {
    brand: {
      lime: "#C8F135",
      violet: "#7C3AED",
      red: "#FF4D6D",
      ink: "#0A0A0F",
      charcoal: "#111118",
      card: "#16161E",
      border: "rgba(255,255,255,0.07)",
    },
  },
  fonts: {
    heading: "'Syne', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'Space Mono', monospace",
  },
  styles: {
    global: {
      "html, body": {
        bg: "#0A0A0F",
        color: "#FAFAF7",
        overflowX: "hidden",
        scrollBehavior: "smooth",
      },
      "::selection": { background: "#C8F135", color: "#0A0A0F" },
      "*": { boxSizing: "border-box" },
    },
  },
  components: {
    Button: {
      baseStyle: { fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, letterSpacing: "-0.01em", borderRadius: "10px" },
      variants: {
        lime: { bg: "#C8F135", color: "#0A0A0F", _hover: { bg: "#b8e020", transform: "translateY(-1px)" }, transition: "all 0.2s" },
        ghost_white: { bg: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.14)", _hover: { bg: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.35)" }, transition: "all 0.2s" },
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
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({ opacity: 1, transition: { duration: 0.5, delay: i * 0.07 } }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: (i = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 } }),
};

function ScrollReveal({ children, delay = 0, variant = "fadeUp" }: { children: ReactNode; delay?: number; variant?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const v = variant === "scaleIn" ? scaleIn : variant === "fadeIn" ? fadeIn : fadeUp;
  return (
    <MotionBox ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={v} custom={delay}>
      {children}
    </MotionBox>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GLOBAL STYLES INJECTOR (fonts + keyframes)
// ─────────────────────────────────────────────────────────────────────────────
function GlobalCSS() {
  useEffect(() => {
    const style = document.createElement("style");
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
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Platform", "How It Works", "Pricing"];

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
        borderRadius={{ base: "18px", md: "999px" }} // ✅ FIX: no extreme curve on mobile
        boxShadow="0 10px 30px rgba(0,0,0,0.45)"
        bg={scrolled ? "rgba(15,15,15,0.9)" : "rgba(10,10,10,0.85)"}
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
            <HStack
              spacing={8}
              display={{ base: "none", md: "flex" }}
            >
              {links.map((link) => (
                <Text
                  key={link}
                  fontSize="14px"
                  color="whiteAlpha.700"
                  cursor="pointer"
                  _hover={{ color: "#C8F135" }}
                  transition="0.2s"
                >
                  {link}
                </Text>
              ))}
            </HStack>

            {/* CTA DESKTOP */}
            <HStack spacing={3} display={{ base: "none", md: "flex" }}>
              <Text fontSize="14px" color="whiteAlpha.600">
                Sign in
              </Text>

              <Button
                size="sm"
                bg="#C8F135"
                color="black"
                borderRadius="full"
                _hover={{ bg: "#d4ff4a" }}
              >
                Get Started
              </Button>
            </HStack>

            {/* MOBILE BUTTON (FIXED SHAPE) */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="menu"
              icon={open ? <X size={20} /> : <Menu size={20} />}
              onClick={() => setOpen(!open)}
              variant="ghost"
              color="white"
              w="42px"
              h="42px"
              borderRadius="12px" // ✅ FIX: removes circular feel
              _hover={{ bg: "whiteAlpha.100" }}
              _active={{ bg: "whiteAlpha.200", transform: "scale(0.96)" }}
              _focusVisible={{ boxShadow: "none" }}
            />
          </HStack>

          {/* MOBILE MENU (FIXED CARD STYLE) */}
          <AnimatePresence>
            {open && (
              <MotionBox
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
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
                        _hover={{ color: "#C8F135" }}
                      >
                        {link}
                      </Text>
                    ))}

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
function Typewriter() {
  const words = ["skills.", "thinking.", "code.", "merit."];
  const [idx, setIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const w = words[idx];
    const t = setTimeout(() => {
      if (!del) {
        if (chars < w.length) setChars(c => c + 1);
        else setTimeout(() => setDel(true), 1600);
      } else {
        if (chars > 0) setChars(c => c - 1);
        else { setDel(false); setIdx(i => (i + 1) % words.length); }
      }
    }, del ? 50 : 85);
    return () => clearTimeout(t);
  }, [chars, del, idx]);

  return (
    <Box as="span" color="brand.lime" fontFamily="'Bebas Neue', sans-serif">
      {words[idx].slice(0, chars)}
      <span className="cursor-blink" />
    </Box>
  );
}

function HeroFloatCard({ top, left, right, bottom, children }: any) {
  return (
    <Box
      position="absolute" top={top} left={left} right={right} bottom={bottom}
      bg="rgba(255,255,255,0.04)" backdropFilter="blur(20px)"
      border="1px solid rgba(255,255,255,0.08)" borderRadius="18px"
      px={5} py={4} display={{ base: "none", xl: "block" }}
    >
      {children}
    </Box>
  );
}

function Hero() {

  return (
    <Box as="section" position="relative" minH="100vh" overflow="hidden"
      display="flex" flexDir="column" alignItems="center" justifyContent="center"
      pt="120px" pb="100px" px={6} textAlign="center">
<Box
  position="absolute"
  inset={0}
  zIndex={0}
  transform="translate(-100px, -100px)"
  pointerEvents="none"
>
  <Spotlight />
</Box>
      {/* Radial glows */}
      <Box position="absolute" top="28%" left="50%" transform="translate(-50%,-50%)"
        w="900px" h="600px" pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(200,241,53,0.07) 0%, transparent 68%)" />
      <Box position="absolute" bottom="10%" right="8%" w="450px" h="450px" pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, transparent 68%)" />
      <Box position="absolute" top="20%" left="5%" w="350px" h="350px" pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(255,77,109,0.08) 0%, transparent 68%)" />

      {/* Badge */}
      
     <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
      <span
        className={cn(
          "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
      <AnimatedGradientText className="text-sm font-medium">
        Introducing SkillTech
      </AnimatedGradientText>
      <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    </div>
  

      {/* Headline */}
      <MotionBox initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
        <Heading
          fontFamily="'Bebas Neue', sans-serif" fontWeight={400}
          fontSize={{ base: "4.5rem", md: "7rem", lg: "9rem" }}
          lineHeight={0.95} letterSpacing="-0.02em" mb={5}
         className="mt-10 pointer-events-none bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-center text-8xl leading-none font-extrabold tracking-tight whitespace-pre-wrap text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.25)]"
         > HIRED ON YOUR
          <br />
          <Typewriter />
        </Heading>
      </MotionBox>

      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.22 }}>
        <Text
          fontFamily="'Instrument Serif', serif" fontStyle="italic"
          fontSize={{ base: "1.2rem", md: "1.6rem" }} fontWeight={400}
          color="rgba(255,255,255,0.38)" mb={10} maxW="560px" mx="auto" lineHeight={1.55}
        >
          "Not your résumé, not your college, not your last employer — your actual code."
        </Text>
      </MotionBox>

      <MotionBox initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.34 }}>
        <HStack spacing={4} justify="center" wrap="wrap">
          <Button variant="lime" size="lg" px={8} py={6} fontSize="16px"
            rightIcon={<Icon as={ArrowRightIcon} w={4} h={4} />}>
            Start Solving — Free
          </Button>
          <Button variant="ghost_white" size="lg" px={8} py={6} fontSize="16px"
            leftIcon={<Icon as={PlayIcon} w={4} h={4} />}>
            See Recruiter Demo
          </Button>
        </HStack>
      </MotionBox>

      {/* Social proof */}
      <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}>
        <HStack spacing={4} mt={12} justify="center">
          <HStack spacing={0}>
            {["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57"].map((bg, i) => (
              <Box key={i} w={8} h={8} borderRadius="full" bg={bg}
                border="2px solid #0A0A0F" ml={i === 0 ? 0 : "-10px"} />
            ))}
          </HStack>
          <Text fontFamily="'DM Sans', sans-serif" fontSize="14px" color="rgba(255,255,255,0.45)">
            <Box as="strong" color="#fff">2,400+</Box> devs already solving challenges
          </Text>
        </HStack>
      </MotionBox>

      {/* Floating stat chips */}
      <HeroFloatCard top="38%" left="4%">
        <Text fontFamily="'Bebas Neue', sans-serif" fontSize="32px" color="brand.lime" lineHeight={1}>100%</Text>
        <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(255,255,255,0.4)" mt={1}>Bias eliminated</Text>
      </HeroFloatCard>

      <HeroFloatCard top="36%" right="4%">
        <Text fontFamily="'Bebas Neue', sans-serif" fontSize="32px" color="#7C3AED" lineHeight={1}>3.2×</Text>
        <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(255,255,255,0.4)" mt={1}>Better hire accuracy</Text>
      </HeroFloatCard>

      <HeroFloatCard bottom="18%" left="6%">
        <HStack spacing={2}>
          <Icon as={ShieldCheckIcon} color="brand.lime" w={4} h={4} />
          <Text fontFamily="'Space Mono', monospace" fontSize="11px" color="rgba(255,255,255,0.55)">Identity: HASHED</Text>
        </HStack>
      </HeroFloatCard>

      <HeroFloatCard bottom="20%" right="5%">
        <HStack spacing={2}>
          <Icon as={CheckBadgeIcon} color="#7C3AED" w={4} h={4} />
          <Text fontFamily="'Space Mono', monospace" fontSize="11px" color="rgba(255,255,255,0.55)">Score: 94 / 100</Text>
        </HStack>
      </HeroFloatCard>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MARQUEE
// ─────────────────────────────────────────────────────────────────────────────
function LogoMarquee() {
  const cos = ["Google", "Meta", "Stripe", "Notion", "Linear", "Figma", "Vercel", "Shopify", "Airbnb", "Discord", "Slack", "GitHub", "Atlassian", "Twilio"];
  return (
    <Box overflow="hidden" py={10} borderTop="1px solid rgba(255,255,255,0.05)" borderBottom="1px solid rgba(255,255,255,0.05)" bg="rgba(255,255,255,0.01)">
      <Flex className="marquee-track">
        {[...cos, ...cos].map((n, i) => (
          <HStack key={i} spacing={3} px={10} flexShrink={0}>
            <Box w="5px" h="5px" borderRadius="full" bg="rgba(255,255,255,0.13)" />
            <Text fontFamily="'Syne', sans-serif" fontWeight={600} fontSize="14px"
              color="rgba(255,255,255,0.22)" textTransform="uppercase" letterSpacing=".06em" whiteSpace="nowrap">
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
      title: "College bias",
      stat: "78%",
      desc: "of candidates filtered before any code is seen",
    },
    {
      icon: DocumentMagnifyingGlassIcon,
      title: "Résumé theater",
      stat: "r=0.27",
      desc: "correlation between résumé & job performance",
    },
    {
      icon: ClockIcon,
      title: "Time drain",
      stat: "23 hrs",
      desc: "wasted per hire on manual screening on average",
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
            // The Problem
          </Text>

          <Heading
            fontFamily="'Syne', sans-serif"
            fontWeight={800}
            fontSize={{ base: "2.4rem", md: "3.6rem" }}
            color="white"
            mb={6}
          >
            Hiring is{" "}
            <Box as="span" fontFamily="'Instrument Serif', serif" fontStyle="italic" color="#FF4D6D">
              broken
            </Box>{" "}
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
            icon={<DocumentMagnifyingGlassIcon className="h-4 w-4 text-[#FF4D6D]" />}
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

const GridItem = ({
  icon,
  title,
  description,
  stat,
  area,
}: GridItemProps) => {
  return (
    <Box
      className={area}
      position="relative"
      borderRadius="20px"
      bg="#0F0F14"
      border="1px solid rgba(255,255,255,0.08)"
      minH="180px"
      overflow="visible"   // 🔥 IMPORTANT FIX
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
      num: "01", icon: CodeBracketIcon, color: "#C8F135", bg: "rgba(200,241,53,0.08)",
      border: "rgba(200,241,53,0.15)",
      title: "Solve Real Problems",
      desc: "Tackle actual engineering challenges — not toy puzzles. Our adaptive system matches difficulty to your skill level in real time.",
      tags: ["Adaptive Difficulty", "Real-world code"],
    },
    {
      num: "02", icon: SparklesIcon, color: "#7C3AED", bg: "rgba(124,58,237,0.08)",
      border: "rgba(124,58,237,0.18)",
      title: "AI Mentor Guides You",
      desc: "LangGraph-powered AI gives targeted hints — not answers. It tracks your thinking, not just your output, building a Ghost Replay of your session.",
      tags: ["LangGraph AI", "Ghost Replay", "Adaptive Hints"],
    },
    {
      num: "03", icon: EyeSlashIcon, color: "#FF4D6D", bg: "rgba(255,77,109,0.07)",
      border: "rgba(255,77,109,0.15)",
      title: "Blind Evaluation",
      desc: "Your identity is cryptographically hashed. Recruiters see only your code quality, problem-solving approach, and performance score.",
      tags: ["Zero Bias", "Identity Hidden", "Fair Scoring"],
    },
    {
      num: "04", icon: TrophyIcon, color: "#F59E0B", bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.15)",
      title: "Merit-Based Reveal",
      desc: "Only after crossing the skill threshold does your identity unlock. Rankings are purely skill-based — the best engineer wins.",
      tags: ["Threshold Unlock", "Skill Ranking"],
    },
  ];

  return (
    <Box as="section" py={32} px={6} position="relative">
      <Box position="absolute" top="30%" left="50%" transform="translate(-50%,-50%)"
        w="700px" h="500px" pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(124,58,237,0.07) 0%, transparent 68%)" />

      <Container maxW="1280px">
        <ScrollReveal>
          <Box textAlign="center" mb={20}>
            <Text fontFamily="'Space Mono', monospace" fontSize="11px" letterSpacing=".12em"
              color="brand.lime" textTransform="uppercase" mb={5}>
              // How It Works
            </Text>
            <Heading fontFamily="'Syne', sans-serif" fontWeight={800}
              fontSize={{ base: "2.4rem", md: "3.4rem" }} letterSpacing="-0.04em" lineHeight={1.1}>
              Four steps to a{" "}
              <Box as="span" fontFamily="'Instrument Serif', serif" fontStyle="italic" fontWeight={400} className="gradient-text">
                fairer hire.
              </Box>
            </Heading>
          </Box>
        </ScrollReveal>
 
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {steps.map((s, i) => (
            <ScrollReveal key={i} delay={i} variant="scaleIn">
              <Box
                bg="#16161E" border={`1px solid ${s.border}`} borderRadius="22px"
                p={8} h="full" position="relative" overflow="hidden"
                _hover={{ transform: "translateY(-4px)", boxShadow: `0 20px 60px ${s.bg}` }}
                transition="all 0.3s ease" cursor="default"
              >
                {/* Number watermark */}
                <Text position="absolute" top={4} right={6}
                  fontFamily="'Bebas Neue', sans-serif" fontSize="72px"
                  color="rgba(255,255,255,0.04)" lineHeight={1} userSelect="none">
                  {s.num}
                </Text>

                <Box bg={s.bg} borderRadius="14px" p={3} display="inline-flex" mb={5}>
                  <Icon as={s.icon} color={s.color} w={6} h={6} />
                </Box>

                <Heading fontFamily="'Syne', sans-serif" fontWeight={700} fontSize="22px"
                  letterSpacing="-0.025em" mb={3}>
                  {s.title}
                </Heading>
                <Text fontFamily="'DM Sans', sans-serif" fontSize="15px" fontWeight={300}
                  color="rgba(255,255,255,0.52)" lineHeight={1.78} mb={5}>
                  {s.desc}
                </Text>

                <HStack spacing={2} wrap="wrap">
                  {s.tags.map(tag => (
                    <Tag key={tag} bg="rgba(255,255,255,0.05)" color="rgba(255,255,255,0.5)"
                      fontFamily="'Space Mono', monospace" fontSize="10px" borderRadius="6px" px={2} py={1}>
                      {tag}
                    </Tag>
                  ))}
                </HStack>
              </Box>
            </ScrollReveal>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. AI FEATURE SPOTLIGHT — Ghost Replay
// ─────────────────────────────────────────────────────────────────────────────
function GhostReplay() {
  const [active, setActive] = useState(0);
  const timeline = [
    { t: "0:00", event: "Challenge loaded", code: "function twoSum(nums, target) {", type: "start" },
    { t: "0:42", event: "Attempted brute-force", code: "// O(n²) nested loop approach", type: "attempt" },
    { t: "1:15", event: "AI Hint triggered", code: "💡 Think about hash maps for O(n)...", type: "hint" },
    { t: "2:03", event: "Pivoted strategy", code: "const map = new Map();", type: "pivot" },
    { t: "3:28", event: "Optimal solution", code: "// ✓ O(n) — 100% test pass", type: "success" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % timeline.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <Box as="section" py={32} px={6}>
      <Container maxW="1280px">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
          <ScrollReveal>
            <Box>
              <Text fontFamily="'Space Mono', monospace" fontSize="11px" letterSpacing=".12em"
                color="#7C3AED" textTransform="uppercase" mb={5}>
                // Core Innovation
              </Text>
              <Heading fontFamily="'Syne', sans-serif" fontWeight={800}
                fontSize={{ base: "2.4rem", md: "3.2rem" }} letterSpacing="-0.04em" lineHeight={1.1} mb={6}>
                Ghost Replay:
                <br />
                <Box as="span" fontFamily="'Instrument Serif', serif" fontStyle="italic" fontWeight={400} color="#7C3AED">
                  how you think,
                </Box>
                <br />
                not just what you wrote.
              </Heading>
              <Text fontFamily="'DM Sans', sans-serif" fontSize="16px" fontWeight={300}
                color="rgba(255,255,255,0.52)" lineHeight={1.85} mb={8}>
                Our AI doesn't just evaluate the final solution. It records every
                keystroke, every pivot, every hint request — generating a full
                thinking timeline that reveals problem-solving depth.
              </Text>

              <VStack spacing={3} align="flex-start">
                {[
                  { icon: LightBulbIcon, text: "Adaptive hint engine (LangGraph)" },
                  { icon: CpuChipIcon, text: "Real-time cognition tracking" },
                  { icon: ChartBarIcon, text: "Strategy + efficiency scoring" },
                ].map((f, i) => (
                  <HStack key={i} spacing={3}>
                    <Box bg="rgba(124,58,237,0.12)" borderRadius="8px" p={2}>
                      <Icon as={f.icon} color="#7C3AED" w={4} h={4} />
                    </Box>
                    <Text fontFamily="'DM Sans', sans-serif" fontSize="15px" color="rgba(255,255,255,0.65)">
                      {f.text}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </ScrollReveal>

          {/* Ghost Replay UI mockup */}
          <ScrollReveal delay={1} variant="scaleIn">
            <Box bg="#16161E" border="1px solid rgba(255,255,255,0.07)" borderRadius="24px" p={6} overflow="hidden">
              <HStack justify="space-between" mb={5}>
                <HStack spacing={2}>
                  <Box w="10px" h="10px" borderRadius="full" bg="#FF5F57" />
                  <Box w="10px" h="10px" borderRadius="full" bg="#FEBC2E" />
                  <Box w="10px" h="10px" borderRadius="full" bg="#28C840" />
                </HStack>
                <Text fontFamily="'Space Mono', monospace" fontSize="11px" color="rgba(255,255,255,0.3)">
                  ghost_replay.sp
                </Text>
              </HStack>

              {/* Timeline */}
              <VStack spacing={0} align="stretch">
                {timeline.map((item, i) => (
                  <Box key={i}
                    bg={active === i ? "rgba(124,58,237,0.1)" : "transparent"}
                    border={active === i ? "1px solid rgba(124,58,237,0.25)" : "1px solid transparent"}
                    borderRadius="12px" p={3} mb={1} transition="all 0.4s ease">
                    <HStack spacing={3} mb={1}>
                      <Text fontFamily="'Space Mono', monospace" fontSize="10px" color="rgba(255,255,255,0.3)">{item.t}</Text>
                      <Box w="1px" h="12px" bg="rgba(255,255,255,0.08)" />
                      <Text fontFamily="'DM Sans', sans-serif" fontSize="12px"
                        color={active === i ? "#7C3AED" : "rgba(255,255,255,0.4)"} fontWeight={500}>
                        {item.event}
                      </Text>
                    </HStack>
                    <Text fontFamily="'Space Mono', monospace" fontSize="12px"
                      color={item.type === "hint" ? "#C8F135" : item.type === "success" ? "#4ADE80" : "rgba(255,255,255,0.55)"}
                      pl={8}>
                      {item.code}
                    </Text>
                  </Box>
                ))}
              </VStack>

              {/* Score bar */}
              <Box mt={5} pt={5} borderTop="1px solid rgba(255,255,255,0.06)">
                <HStack justify="space-between" mb={2}>
                  <Text fontFamily="'Space Mono', monospace" fontSize="11px" color="rgba(255,255,255,0.35)">PERFORMANCE SCORE</Text>
                  <Text fontFamily="'Bebas Neue', sans-serif" fontSize="22px" color="#C8F135" lineHeight={1}>94 / 100</Text>
                </HStack>
                <Box h="4px" bg="rgba(255,255,255,0.07)" borderRadius="full">
                  <Box h="full" w="94%" bg="linear-gradient(90deg, #C8F135, #6EE7B7)" borderRadius="full"
                    transition="width 1s ease" />
                </Box>
              </Box>
            </Box>
          </ScrollReveal>
        </Grid>
      </Container>
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
      py={{ base: "6rem", md: "10rem" }}
      px="1.5rem"
      borderTop="1px solid rgba(255,255,255,0.1)"
      borderBottom="1px solid rgba(255,255,255,0.1)"
      bg="#000"
    >
      {/* 🔥 FULL SECTION BACKGROUND LAYER */}
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        pointerEvents="none"
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
      />

      {/* CONTENT */}
     <Box position="relative" zIndex={1}>
  
  {/* HEADER */}
  <Box
    maxW="70rem"
    mx="auto"
    textAlign="center"
    mb={{ base: "3rem", md: "5rem" }}
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
      // Key Differentiators
    </Box>

    {/* HEADING (smaller + cleaner scale) */}
    <Box
      as="h2"
      fontSize={{ base: "2.2rem", md: "3.5rem", lg: "4.5rem" }}
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
</Box>
        {/* BENTO GRID */}
        <Box>
          <BentoDemo />
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
      borderRadius="24px"
      overflow="hidden"
      bg="rgba(255,255,255,0.03)"
      border="1px solid rgba(255,255,255,0.08)"
      backdropFilter="blur(18px)"
      position="relative"
    >
      {/* glow */}
      <Box
        position="absolute"
        inset={0}
        bg="radial-gradient(circle at top, rgba(200,241,53,0.08), transparent 60%)"
      />

      {/* HEADER */}
      <HStack
        px={5}
        py={4}
        borderBottom="1px solid rgba(255,255,255,0.06)"
        justify="space-between"
        position="relative"
      >
        <HStack>
          <Icon as={UserGroupIcon} w={4} h={4} color="whiteAlpha.600" />
          <Text fontSize="14px">Candidate Rankings</Text>
        </HStack>

        <Tag bg="rgba(200,241,53,0.1)" color="#C8F135">
          LIVE
        </Tag>
      </HStack>

      {/* ROWS */}
      {candidates.map((c, i) => (
        <HStack
          key={i}
          px={5}
          py={3}
          justify="space-between"
          borderBottom="1px solid rgba(255,255,255,0.05)"
          _hover={{ bg: "rgba(255,255,255,0.02)" }}
          position="relative"
        >
          <Text color="whiteAlpha.600">{c.rank}</Text>

          <HStack>
            {c.skills.map((s) => (
              <Tag key={s} size="sm" bg="whiteAlpha.100">
                {s}
              </Tag>
            ))}
          </HStack>

          <Text color={c.score > 90 ? "#4ADE80" : "#F59E0B"}>
            {c.score}
          </Text>

          <Text fontSize="12px" color="whiteAlpha.500">
            {c.time}
          </Text>

          <Tag
            bg={c.status === "Revealed" ? "green.500Alpha" : "whiteAlpha.200"}
          >
            {c.status}
          </Tag>
        </HStack>
      ))}
    </MotionBox>
  );
}

/* ---------------- MAIN ---------------- */
function RecruiterSection() {
  const candidates = [
    { rank: 1, score: 97, skills: ["DP", "Graphs"], status: "Revealed", time: "28m" },
    { rank: 2, score: 91, skills: ["Hash Maps", "BFS"], status: "Revealed", time: "35m" },
    { rank: 3, score: 86, skills: ["Trees", "Recursion"], status: "Hidden", time: "42m" },
    { rank: 4, score: 78, skills: ["Arrays", "Sorting"], status: "Hidden", time: "51m" },
  ];

  return (
    <Box
      as="section"
      position="relative"
      py={32}
      px={6}
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
          transform="skewY(12deg)"
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
      <Container maxW="1280px" position="relative" zIndex={1}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">

          {/* LEFT */}
          <Dashboard candidates={candidates} />

          {/* RIGHT */}
          <MotionBox
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Text color="#C8F135" fontSize="12px" mb={4}>
              // For Recruiters
            </Text>

            <Text fontSize="3xl" fontWeight="bold" color="white" mb={4}>
              See ability, not background.
            </Text>

            <Text color="whiteAlpha.700" mb={8}>
              Spotlight-driven UI highlights top candidates and removes bias.
            </Text>

            <VStack align="start" spacing={3} mb={10}>
              {[
                "Real-time ranked candidate feed",
                "Watch full Ghost Replay sessions",
                "AI decision insights per candidate",
                "Identity revealed after merit threshold",
                "Zero manual screening",
              ].map((t) => (
                <HStack key={t}>
                  <Icon as={CheckCircleIcon} color="#C8F135" />
                  <Text color="whiteAlpha.700">{t}</Text>
                </HStack>
              ))}
            </VStack>

            <Button
              bg="#C8F135"
              color="black"
              _hover={{ bg: "#d4ff4a" }}
              rightIcon={<ArrowRightIcon width={16} />}
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
function StatCard({
  stat,
  index,
}: {
  stat: Stat;
  index: number;
}) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      whileHover={{ y: -6, scale: 1.04 }}
      textAlign="center"
      p={6}
      borderRadius="18px"
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
        fontSize={{ base: "3rem", md: "4.5rem" }}
        color={stat.color}
        lineHeight={1}
        letterSpacing="-0.02em"
        mb={2}
        textShadow={`0 0 25px ${stat.color}55`}
      >
        {stat.num}
      </Text>

      {/* Label */}
      <Text
        position="relative"
        fontFamily="'DM Sans', sans-serif"
        fontSize="14px"
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
    { num: "2,400+", label: "Devs already solving", color: "#C8F135" },
    { num: "3.2×", label: "Better hire quality", color: "#7C3AED" },
    { num: "0%", label: "Bias in evaluation", color: "#4ADE80" },
    { num: "23h", label: "Avg time saved per hire", color: "#F59E0B" },
  ];

  return (
    <Box
      as="section"
      position="relative"
      py={24}
      px={6}
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
          "absolute inset-0 w-full h-full",
          "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
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
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={10}>
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
    name: "Arjun M.",
    username: "Backend Eng → Series B startup",
    body: "I got interviews at three top-tier companies after years of being filtered out by ATS. SkillProof let my code speak.",
    img: "https://avatar.vercel.sh/arjun",
  },
  {
    name: "Sarah K.",
    username: "Engineering Manager @ Fintech",
    body: "We cut screening time from 3 weeks to 4 days. The Ghost Replay alone is worth it — you actually see how engineers think.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Chen W.",
    username: "Fullstack Dev → Seed startup",
    body: "I never went to a top school. But my score was #1 in the cohort. That's a feeling I can't describe.",
    img: "https://avatar.vercel.sh/chen",
  },
  {
    name: "Rohit S.",
    username: "Frontend Dev → Google",
    body: "Finally a platform where my skills mattered more than my resume. Got shortlisted instantly.",
    img: "https://avatar.vercel.sh/rohit",
  },
  {
    name: "Ayesha P.",
    username: "SWE → Amazon",
    body: "The AI mentor actually improved how I think about problems. This is next level.",
    img: "https://avatar.vercel.sh/ayesha",
  },
  {
    name: "Daniel T.",
    username: "ML Engineer → Stripe",
    body: "Ghost Replay is insane. Recruiters finally see how I solve problems, not just results.",
    img: "https://avatar.vercel.sh/daniel",
  },
]

const firstRow = testimonials.slice(0, 3)
const secondRow = testimonials.slice(3, 6)

const TestimonialCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-2xl border p-5",
        "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
        "transition-all"
      )}
    >
      <div className="flex items-center gap-3">
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
  )
}

function Testimonials() {
  return (
    <section
  style={{
    paddingTop: "12rem",
    paddingBottom: "12rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    backgroundColor: "black",
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* Heading */}
  <div style={{ textAlign: "center", marginBottom: "5rem" }}>
    
    <p
      style={{
        fontSize: "1.25rem",
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        color: "#A3E635",
        marginBottom: "1.5rem",
        fontWeight: 500,
      }}
    >
      // Testimonials
    </p>

    <h2
      style={{
        fontSize: "clamp(3.5rem, 6vw, 6.5rem)",
        fontWeight: 800,
        color: "#ffffff",
        lineHeight: 1,
      }}
    >
      Real people.{" "}
      <span
        style={{
          fontStyle: "italic",
          color: "#A3E635",
          fontFamily: "serif",
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
  )
}
// ─────────────────────────────────────────────────────────────────────────────
// 14. PRICING
// ─────────────────────────────────────────────────────────────────────────────


function Pricing() {
  const plans = [
    {
      name: "Developer",
      price: "Free",
      period: "",
      desc: "For individual developers building their profile.",
      features: [
        "Unlimited challenge attempts",
        "AI mentor (basic hints)",
        "Ghost Replay viewer",
        "Merit score + badge",
        "Community leaderboard",
      ],
      cta: "Start Solving",
      highlight: false,
      icon: Sparkles,
    },
    {
      name: "Recruiter",
      price: "$299",
      period: "/month",
      desc: "For hiring teams serious about skill-based hiring.",
      features: [
        "Unlimited candidate evaluations",
        "Full Ghost Replay for every session",
        "AI decision insights",
        "Blind ranking dashboard",
        "ATS integration",
        "Dedicated success manager",
      ],
      cta: "Start Hiring",
      highlight: true,
      icon: Zap,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For large orgs with custom workflows.",
      features: [
        "Everything in Recruiter",
        "Custom challenge library",
        "SSO + SAML",
        "SOC 2 Type II compliant",
        "SLA + dedicated infra",
        "White-label option",
      ],
      cta: "Contact Us",
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
            // Pricing
          </Text>

          <Heading fontSize={{ base: "1.8rem", md: "2.8rem" }}>
            Simple pricing{" "}
            <AuroraText colors={["#C8F135", "#7C3AED"]}>
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
                bg={p.highlight ? "brand.lime" : "whiteAlpha.100"}
                color={p.highlight ? "black" : "white"}
                _hover={{
                  bg: p.highlight ? "brand.lime" : "whiteAlpha.200",
                  transform: "scale(1.02)",
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
        <Box
          maxW="700px"
          mx="auto"
          textAlign="center"
        >
          <Text
            fontFamily="'Space Mono', monospace"
            fontSize="10px"
            letterSpacing=".14em"
            color="brand.lime"
            textTransform="uppercase"
            mb={2}
          >
            // Ready to Prove Yourself?
          </Text>

          <Heading
            fontFamily="'Bebas Neue', sans-serif"
            fontWeight={400}
            fontSize={{ base: "2rem", md: "2.5rem" }}
            lineHeight={1.2}
            mb={3}
          >
            YOUR CODE.{' '}
            <AuroraText
              colors={["#C8F135", "#7C3AED", "#FF4D6D", "#C8F135"]}
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
                padding: "10px 20px",
                fontSize: "13px",
                borderRadius: "8px",
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
                borderColor: "brand.lime",
                color: "brand.lime",
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
      <Box
        position="absolute"
        inset={0}
        bg="rgba(0,0,0,0.7)"
        zIndex={1}
      />

      {/* 🔵 Content Layer */}
      <Container position="relative" zIndex={2} maxW="1280px">
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr 1fr" }} gap={10} mb={12}>
          
          {/* Your existing content unchanged */}
          <Box>
            <HStack spacing={3} mb={4}>
              <Box w={8} h={8} bg="brand.lime" borderRadius={8} display="flex" alignItems="center" justifyContent="center">
                <Icon as={CpuChipIcon} color="brand.ink" w={5} h={5} />
              </Box>
              <Text fontFamily="'Cabinet Grotesk', sans-serif" fontWeight={900} fontSize="18px">
                SkillProof
              </Text>
            </HStack>

            <Text fontSize="14px" color="rgba(255,255,255,0.38)" lineHeight={1.8} maxW="260px">
              The platform that hires on skill, not résumés. Blind evaluation powered by AI.
            </Text>
          </Box>

          {[
            { title: "Platform", links: ["How It Works", "AI Mentor", "Ghost Replay", "Pricing"] },
            { title: "Recruiters", links: ["Dashboard", "Candidate Ranking", "Integrations", "Enterprise"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Privacy"] },
          ].map((col, i) => (
            <Box key={i}>
              <Text fontWeight={700} fontSize="13px" color="rgba(255,255,255,0.5)" textTransform="uppercase" mb={4}>
                {col.title}
              </Text>

              <VStack spacing={3} align="flex-start">
                {col.links.map(l => (
                  <Text key={l} as="a" href="#" fontSize="14px"
                    color="rgba(255,255,255,0.38)" _hover={{ color: "#fff" }}>
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