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
  Box, Flex, Grid, GridItem, Text, Heading, Button, Badge,
  Container, Stack, HStack, VStack, Tag, Divider, Icon,
  useColorModeValue, ChakraProvider, extendTheme, Image,
  SimpleGrid, Circle, Square, AspectRatio,
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
const MotionBox = motion(Box as any);
const MotionFlex = motion(Flex as any);
const MotionText = motion(Text as any);

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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <Box
      as="nav" position="fixed" top={0} left={0} right={0} zIndex={200}
      px={8} py={0}
      bg={scrolled ? "rgba(10,10,15,0.88)" : "transparent"}
      backdropFilter={scrolled ? "blur(24px)" : "none"}
      borderBottom={scrolled ? "1px solid rgba(255,255,255,0.06)" : "none"}
      transition="all 0.4s ease"
    >
      <Flex maxW="1280px" mx="auto" h="70px" align="center" justify="space-between">
        {/* Logo */}
        <HStack spacing={3}>
          <Box w={8} h={8} bg="brand.lime" borderRadius={8} display="flex" alignItems="center" justifyContent="center">
            <Icon as={CpuChipIcon} color="brand.ink" w={5} h={5} />
          </Box>
          <Text fontFamily="'Cabinet Grotesk', sans-serif" fontWeight={900} fontSize="20px" letterSpacing="-0.03em">
            SkillProof
          </Text>
        </HStack>

        {/* Links */}
        <HStack spacing={9} display={{ base: "none", md: "flex" }}>
          {["Platform", "How It Works", "For Recruiters", "Pricing"].map(l => (
            <Text key={l} as="a" href="#" fontFamily="'DM Sans', sans-serif" fontSize="14px" fontWeight={400}
              color="rgba(255,255,255,0.55)" _hover={{ color: "#fff" }} transition="color .2s" textDecoration="none">
              {l}
            </Text>
          ))}
        </HStack>

        {/* CTA */}
        <HStack spacing={3}>
          <Text as="a" href="#" fontFamily="'DM Sans', sans-serif" fontSize="14px" color="rgba(255,255,255,0.6)"
            _hover={{ color: "#fff" }} transition="color .2s" textDecoration="none">
            Sign in
          </Text>
          <Button variant="lime" size="sm" px={5} py={2} fontSize="14px">
            Get Early Access
          </Button>
        </HStack>
      </Flex>
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

      {/* Radial glows */}
      <Box position="absolute" top="28%" left="50%" transform="translate(-50%,-50%)"
        w="900px" h="600px" pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(200,241,53,0.07) 0%, transparent 68%)" />
      <Box position="absolute" bottom="10%" right="8%" w="450px" h="450px" pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, transparent 68%)" />
      <Box position="absolute" top="20%" left="5%" w="350px" h="350px" pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(255,77,109,0.08) 0%, transparent 68%)" />

      {/* Badge */}
      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <HStack spacing={2} bg="rgba(200,241,53,0.09)" border="1px solid rgba(200,241,53,0.22)"
          borderRadius="full" px={4} py="6px" display="inline-flex" mb={8}>
          <Box w="6px" h="6px" borderRadius="full" bg="brand.lime" animation="pulseLime 2s infinite" />
          <Text fontFamily="'Space Mono', monospace" fontSize="11px" color="brand.lime" letterSpacing=".1em">
            NOW IN PRIVATE BETA
          </Text>
        </HStack>
      </MotionBox>

      {/* Headline */}
      <MotionBox initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
        <Heading
          fontFamily="'Bebas Neue', sans-serif" fontWeight={400}
          fontSize={{ base: "4.5rem", md: "7rem", lg: "9rem" }}
          lineHeight={0.95} letterSpacing="-0.02em" mb={5}
        >
          HIRED ON YOUR
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
    { icon: XCircleIcon, title: "College bias", stat: "78%", desc: "of candidates filtered before any code is seen", color: "#FF4D6D" },
    { icon: DocumentMagnifyingGlassIcon, title: "Résumé theater", stat: "r=0.27", desc: "correlation between résumé & job performance", color: "#FF4D6D" },
    { icon: ClockIcon, title: "Time drain", stat: "23 hrs", desc: "wasted per hire on manual screening on average", color: "#FF4D6D" },
  ];

  return (
    <Box as="section" py={32} px={6}>
      <Container maxW="1280px">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={20} alignItems="center">
          <ScrollReveal>
            <Box>
              <Text fontFamily="'Space Mono', monospace" fontSize="11px" letterSpacing=".12em"
                color="brand.red" textTransform="uppercase" mb={5}>
                // The Problem
              </Text>
              <Heading fontFamily="'Syne', sans-serif" fontWeight={800}
                fontSize={{ base: "2.6rem", md: "3.8rem" }} lineHeight={1.08} letterSpacing="-0.04em" mb={6}>
                Hiring is{" "}
                <Box as="span" fontFamily="'Instrument Serif', serif" fontStyle="italic" fontWeight={400} color="brand.red">
                  broken
                </Box>{" "}
                by design.
              </Heading>
              <Text fontFamily="'DM Sans', sans-serif" fontSize="17px" fontWeight={300}
                color="rgba(255,255,255,0.5)" lineHeight={1.85} maxW="480px">
                Companies filter by college names and previous employers before ever
                seeing a single line of code. The best engineers from non-traditional
                backgrounds never get a chance.
              </Text>
            </Box>
          </ScrollReveal>

          <VStack spacing={4} align="stretch">
            {problems.map((p, i) => (
              <ScrollReveal key={i} delay={i}>
                <HStack spacing={5} bg="rgba(255,77,109,0.06)" border="1px solid rgba(255,77,109,0.12)"
                  borderRadius="16px" p={5} align="flex-start"
                  _hover={{ bg: "rgba(255,77,109,0.1)", borderColor: "rgba(255,77,109,0.22)" }}
                  transition="all 0.25s">
                  <Box flexShrink={0} bg="rgba(255,77,109,0.12)" borderRadius="10px" p={2}>
                    <Icon as={p.icon} color={p.color} w={5} h={5} />
                  </Box>
                  <Box>
                    <HStack spacing={3} mb={1}>
                      <Text fontFamily="'Syne', sans-serif" fontWeight={700} fontSize="15px">{p.title}</Text>
                      <Text fontFamily="'Space Mono', monospace" fontSize="12px" color={p.color} fontWeight={700}>{p.stat}</Text>
                    </HStack>
                    <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="rgba(255,255,255,0.42)" lineHeight={1.6}>{p.desc}</Text>
                  </Box>
                </HStack>
              </ScrollReveal>
            ))}
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
}

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
function Features() {
  const features = [
    {
      icon: SparklesIcon, color: "#C8F135", title: "AI Mentor",
      desc: "LangGraph-powered hints that adapt to your exact approach — not generic suggestions.",
    },
    {
      icon: EyeSlashIcon, color: "#7C3AED", title: "Blind Hiring",
      desc: "Cryptographic identity hashing. Recruiters cannot see name, school, or company until threshold is crossed.",
    },
    {
      icon: CursorArrowRaysIcon, color: "#FF4D6D", title: "Ghost Replay",
      desc: "Full thinking timeline. Recruiters watch how decisions were made, not just the final answer.",
    },
    {
      icon: ArrowTrendingUpIcon, color: "#F59E0B", title: "Adaptive Difficulty",
      desc: "Problem difficulty adjusts dynamically to maintain optimal challenge vs. ability balance.",
    },
    {
      icon: FingerPrintIcon, color: "#4ADE80", title: "Merit Scoring",
      desc: "Multi-dimensional score: correctness, efficiency, readability, approach quality.",
    },
    {
      icon: RocketLaunchIcon, color: "#38BDF8", title: "Instant Ranking",
      desc: "Recruiter dashboard shows live ranked candidates — no manual screening needed.",
    },
  ];

  return (
    <Box as="section" py={32} px={6} bg="rgba(255,255,255,0.01)"
      borderTop="1px solid rgba(255,255,255,0.05)" borderBottom="1px solid rgba(255,255,255,0.05)">
      <Container maxW="1280px">
        <ScrollReveal>
          <Box textAlign="center" mb={20}>
            <Text fontFamily="'Space Mono', monospace" fontSize="11px" letterSpacing=".12em"
              color="brand.lime" textTransform="uppercase" mb={5}>
              // Key Differentiators
            </Text>
            <Heading fontFamily="'Syne', sans-serif" fontWeight={800}
              fontSize={{ base: "2.4rem", md: "3.4rem" }} letterSpacing="-0.04em">
              Not just a platform.
              <br />
              <Box as="span" fontFamily="'Instrument Serif', serif" fontStyle="italic" fontWeight={400} color="brand.lime">
                A fair future for hiring.
              </Box>
            </Heading>
          </Box>
        </ScrollReveal>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.5} variant="scaleIn">
              <Box
                bg="#16161E" border="1px solid rgba(255,255,255,0.06)" borderRadius="20px"
                p={7} h="full" position="relative" overflow="hidden"
                _hover={{ borderColor: f.color, transform: "translateY(-3px)" }}
                transition="all 0.28s ease" cursor="default"
              >
                <Box position="absolute" top={0} left={0} right={0} h="2px"
                  bg={`linear-gradient(90deg, ${f.color}00, ${f.color}, ${f.color}00)`} opacity={0.6} />
                <Box bg={`${f.color}14`} borderRadius="12px" p="10px" display="inline-flex" mb={5}>
                  <Icon as={f.icon} color={f.color} w={6} h={6} />
                </Box>
                <Heading fontFamily="'Syne', sans-serif" fontWeight={700} fontSize="19px"
                  letterSpacing="-0.025em" mb={3}>
                  {f.title}
                </Heading>
                <Text fontFamily="'DM Sans', sans-serif" fontSize="14px" fontWeight={300}
                  color="rgba(255,255,255,0.48)" lineHeight={1.78}>
                  {f.desc}
                </Text>
              </Box>
            </ScrollReveal>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. RECRUITER SECTION
// ─────────────────────────────────────────────────────────────────────────────
function RecruiterSection() {
  const candidates = [
    { rank: 1, score: 97, skills: ["DP", "Graphs"], status: "Revealed", time: "28m" },
    { rank: 2, score: 91, skills: ["Hash Maps", "BFS"], status: "Revealed", time: "35m" },
    { rank: 3, score: 86, skills: ["Trees", "Recursion"], status: "Hidden", time: "42m" },
    { rank: 4, score: 78, skills: ["Arrays", "Sorting"], status: "Hidden", time: "51m" },
  ];

  return (
    <Box as="section" py={32} px={6}>
      <Container maxW="1280px">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={16} alignItems="center">
          {/* Dashboard mockup */}
          <ScrollReveal variant="scaleIn">
            <Box bg="#16161E" border="1px solid rgba(255,255,255,0.07)" borderRadius="24px" overflow="hidden">
              {/* Header */}
              <Box px={6} py={4} borderBottom="1px solid rgba(255,255,255,0.06)"
                bg="rgba(255,255,255,0.02)">
                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Icon as={UserGroupIcon} color="rgba(255,255,255,0.4)" w={4} h={4} />
                    <Text fontFamily="'Syne', sans-serif" fontWeight={600} fontSize="14px">
                      Candidate Rankings
                    </Text>
                  </HStack>
                  <Tag bg="rgba(200,241,53,0.1)" color="brand.lime" fontFamily="'Space Mono', monospace"
                    fontSize="10px" borderRadius="6px" px={2}>
                    LIVE
                  </Tag>
                </HStack>
              </Box>

              {/* Table header */}
              <Grid templateColumns="50px 1fr 80px 80px 70px" px={6} py={3}
                borderBottom="1px solid rgba(255,255,255,0.04)">
                {["#", "Skills", "Score", "Time", "Status"].map(h => (
                  <Text key={h} fontFamily="'Space Mono', monospace" fontSize="10px"
                    color="rgba(255,255,255,0.25)" textTransform="uppercase">
                    {h}
                  </Text>
                ))}
              </Grid>

              {candidates.map((c, i) => (
                <Grid key={i} templateColumns="50px 1fr 80px 80px 70px" px={6} py={4}
                  borderBottom={i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none"}
                  bg={i === 0 ? "rgba(200,241,53,0.03)" : "transparent"}
                  _hover={{ bg: "rgba(255,255,255,0.02)" }} transition="bg 0.2s" alignItems="center">
                  <Text fontFamily="'Bebas Neue', sans-serif" fontSize="22px"
                    color={i === 0 ? "brand.lime" : "rgba(255,255,255,0.25)"}>
                    {c.rank}
                  </Text>
                  <HStack spacing={2} wrap="wrap">
                    {c.skills.map(s => (
                      <Tag key={s} bg="rgba(255,255,255,0.05)" color="rgba(255,255,255,0.5)"
                        fontFamily="'Space Mono', monospace" fontSize="9px" borderRadius="5px" px={2} py="2px">
                        {s}
                      </Tag>
                    ))}
                  </HStack>
                  <Text fontFamily="'Bebas Neue', sans-serif" fontSize="20px"
                    color={c.score >= 90 ? "#4ADE80" : c.score >= 80 ? "#F59E0B" : "rgba(255,255,255,0.5)"}>
                    {c.score}
                  </Text>
                  <Text fontFamily="'Space Mono', monospace" fontSize="12px" color="rgba(255,255,255,0.35)">
                    {c.time}
                  </Text>
                  <Box px={2} py={1} borderRadius="6px" display="inline-flex" alignItems="center"
                    bg={c.status === "Revealed" ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.05)"}>
                    <Text fontFamily="'Space Mono', monospace" fontSize="9px"
                      color={c.status === "Revealed" ? "#4ADE80" : "rgba(255,255,255,0.3)"}>
                      {c.status === "Hidden" ? "🔒" : "✓"} {c.status}
                    </Text>
                  </Box>
                </Grid>
              ))}
            </Box>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            <Box>
              <Text fontFamily="'Space Mono', monospace" fontSize="11px" letterSpacing=".12em"
                color="brand.lime" textTransform="uppercase" mb={5}>
                // For Recruiters
              </Text>
              <Heading fontFamily="'Syne', sans-serif" fontWeight={800}
                fontSize={{ base: "2.4rem", md: "3.2rem" }} letterSpacing="-0.04em" lineHeight={1.1} mb={6}>
                See{" "}
                <Box as="span" fontFamily="'Instrument Serif', serif" fontStyle="italic" fontWeight={400} color="brand.lime">
                  ability,
                </Box>
                <br />not background.
              </Heading>
              <Text fontFamily="'DM Sans', sans-serif" fontSize="16px" fontWeight={300}
                color="rgba(255,255,255,0.52)" lineHeight={1.85} mb={8}>
                Your dashboard shows ranked candidates with skill scores, Ghost Replay
                sessions, and decision insights — all before you ever see a name.
              </Text>

              <VStack spacing={4} align="flex-start">
                {[
                  "Real-time ranked candidate feed",
                  "Watch full Ghost Replay of any session",
                  "AI-generated decision insights per candidate",
                  "Identity reveal only after merit threshold",
                  "Zero manual screening overhead",
                ].map((item, i) => (
                  <HStack key={i} spacing={3}>
                    <Icon as={CheckCircleSolid} color="brand.lime" w={5} h={5} flexShrink={0} />
                    <Text fontFamily="'DM Sans', sans-serif" fontSize="15px" color="rgba(255,255,255,0.65)">
                      {item}
                    </Text>
                  </HStack>
                ))}
              </VStack>

              <Button variant="lime" size="lg" mt={10} px={8} py={6} fontSize="16px"
                rightIcon={<Icon as={ArrowRightIcon} w={4} h={4} />}>
                Book a Recruiter Demo
              </Button>
            </Box>
          </ScrollReveal>
        </Grid>
      </Container>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. STATS ROW
// ─────────────────────────────────────────────────────────────────────────────
function StatsRow() {
  const stats = [
    { num: "2,400+", label: "Devs already solving", color: "#C8F135" },
    { num: "3.2×", label: "Better hire quality", color: "#7C3AED" },
    { num: "0%", label: "Bias in evaluation", color: "#4ADE80" },
    { num: "23h", label: "Avg time saved per hire", color: "#F59E0B" },
  ];

  return (
    <Box as="section" py={20} px={6}
      borderTop="1px solid rgba(255,255,255,0.05)" borderBottom="1px solid rgba(255,255,255,0.05)"
      bg="rgba(255,255,255,0.015)">
      <Container maxW="1280px">
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
          {stats.map((s, i) => (
            <ScrollReveal key={i} delay={i * 0.5}>
              <Box textAlign="center">
                <Text fontFamily="'Bebas Neue', sans-serif" fontSize={{ base: "3rem", md: "4.5rem" }}
                  color={s.color} lineHeight={1} letterSpacing="-0.02em" mb={2}>
                  {s.num}
                </Text>
                <Text fontFamily="'DM Sans', sans-serif" fontSize="14px" fontWeight={300}
                  color="rgba(255,255,255,0.4)">
                  {s.label}
                </Text>
              </Box>
            </ScrollReveal>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────
function Testimonials() {
  const quotes = [
    {
      quote: "I got interviews at three top-tier companies after years of being filtered out by ATS. SkillProof let my code speak.",
      name: "Arjun M.", role: "Backend Eng → Hired at Series B startup", avatar: "#7C3AED",
    },
    {
      quote: "We cut screening time from 3 weeks to 4 days. The Ghost Replay alone is worth it — you actually see how engineers think.",
      name: "Sarah K.", role: "Engineering Manager @ Fintech", avatar: "#FF4D6D",
    },
    {
      quote: "I never went to a top school. But my score was #1 in the cohort. That's a feeling I can't describe.",
      name: "Chen W.", role: "Fullstack Dev → Hired at Seed startup", avatar: "#C8F135",
    },
  ];

  return (
    <Box as="section" py={32} px={6}>
      <Container maxW="1280px">
        <ScrollReveal>
          <Box textAlign="center" mb={16}>
            <Text fontFamily="'Space Mono', monospace" fontSize="11px" letterSpacing=".12em"
              color="rgba(255,255,255,0.3)" textTransform="uppercase" mb={5}>
              // Testimonials
            </Text>
            <Heading fontFamily="'Syne', sans-serif" fontWeight={800}
              fontSize={{ base: "2.2rem", md: "3rem" }} letterSpacing="-0.04em">
              Real people.{" "}
              <Box as="span" fontFamily="'Instrument Serif', serif" fontStyle="italic" fontWeight={400} color="rgba(255,255,255,0.4)">
                Real results.
              </Box>
            </Heading>
          </Box>
        </ScrollReveal>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {quotes.map((q, i) => (
            <ScrollReveal key={i} delay={i} variant="scaleIn">
              <Box bg="#16161E" border="1px solid rgba(255,255,255,0.06)" borderRadius="20px"
                p={7} h="full" position="relative">
                <HStack mb={4}>
                  {Array(5).fill(0).map((_, j) => (
                    <Icon key={j} as={StarSolid} color="#F59E0B" w={4} h={4} />
                  ))}
                </HStack>
                <Text fontFamily="'Instrument Serif', serif" fontStyle="italic" fontSize="17px"
                  color="rgba(255,255,255,0.72)" lineHeight={1.7} mb={6}>
                  "{q.quote}"
                </Text>
                <HStack spacing={3} pt={4} borderTop="1px solid rgba(255,255,255,0.06)">
                  <Box w={10} h={10} borderRadius="full" bg={q.avatar}
                    display="flex" alignItems="center" justifyContent="center">
                    <Text fontFamily="'Cabinet Grotesk', sans-serif" fontWeight={800} fontSize="14px" color="#0A0A0F">
                      {q.name[0]}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontFamily="'Syne', sans-serif" fontWeight={600} fontSize="14px">{q.name}</Text>
                    <Text fontFamily="'DM Sans', sans-serif" fontSize="12px" color="rgba(255,255,255,0.38)">{q.role}</Text>
                  </Box>
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
// 14. PRICING
// ─────────────────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Developer", price: "Free", period: "",
      desc: "For individual developers building their profile.",
      features: ["Unlimited challenge attempts", "AI mentor (basic hints)", "Ghost Replay viewer", "Merit score + badge", "Community leaderboard"],
      cta: "Start Solving", variant: "ghost_white" as const, highlight: false,
    },
    {
      name: "Recruiter", price: "$299", period: "/month",
      desc: "For hiring teams serious about skill-based hiring.",
      features: ["Unlimited candidate evaluations", "Full Ghost Replay for every session", "AI decision insights", "Blind ranking dashboard", "ATS integration (Lever, Greenhouse)", "Dedicated success manager"],
      cta: "Start Hiring", variant: "lime" as const, highlight: true,
    },
    {
      name: "Enterprise", price: "Custom", period: "",
      desc: "For large orgs with custom workflows and compliance.",
      features: ["Everything in Recruiter", "Custom challenge library", "SSO + SAML", "SOC 2 Type II compliant", "SLA + dedicated infra", "White-label option"],
      cta: "Contact Us", variant: "ghost_white" as const, highlight: false,
    },
  ];

  return (
    <Box as="section" py={32} px={6} bg="rgba(255,255,255,0.01)"
      borderTop="1px solid rgba(255,255,255,0.05)">
      <Container maxW="1280px">
        <ScrollReveal>
          <Box textAlign="center" mb={20}>
            <Text fontFamily="'Space Mono', monospace" fontSize="11px" letterSpacing=".12em"
              color="brand.lime" textTransform="uppercase" mb={5}>
              // Pricing
            </Text>
            <Heading fontFamily="'Syne', sans-serif" fontWeight={800}
              fontSize={{ base: "2.4rem", md: "3.4rem" }} letterSpacing="-0.04em">
              Simple pricing.{" "}
              <Box as="span" fontFamily="'Instrument Serif', serif" fontStyle="italic" fontWeight={400} color="brand.lime">
                No surprises.
              </Box>
            </Heading>
          </Box>
        </ScrollReveal>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} alignItems="center">
          {plans.map((p, i) => (
            <ScrollReveal key={i} delay={i} variant="scaleIn">
              <Box
                bg={p.highlight ? "rgba(200,241,53,0.05)" : "#16161E"}
                border={p.highlight ? "2px solid rgba(200,241,53,0.35)" : "1px solid rgba(255,255,255,0.07)"}
                borderRadius="24px" p={8} h="full" position="relative"
                transform={p.highlight ? { base: "none", md: "scale(1.04)" } : "none"}
              >
                {p.highlight && (
                  <Box position="absolute" top="-14px" left="50%" transform="translateX(-50%)">
                    <Tag bg="brand.lime" color="brand.ink" fontFamily="'Cabinet Grotesk', sans-serif"
                      fontWeight={800} fontSize="11px" borderRadius="full" px={4} py="4px">
                      MOST POPULAR
                    </Tag>
                  </Box>
                )}

                <Text fontFamily="'Syne', sans-serif" fontWeight={700} fontSize="14px"
                  color="rgba(255,255,255,0.5)" textTransform="uppercase" letterSpacing=".06em" mb={3}>
                  {p.name}
                </Text>
                <HStack align="baseline" mb={3}>
                  <Text fontFamily="'Bebas Neue', sans-serif" fontSize="52px" lineHeight={1} letterSpacing="-0.02em"
                    color={p.highlight ? "brand.lime" : "#fff"}>
                    {p.price}
                  </Text>
                  <Text fontFamily="'DM Sans', sans-serif" fontSize="16px" color="rgba(255,255,255,0.35)">{p.period}</Text>
                </HStack>
                <Text fontFamily="'DM Sans', sans-serif" fontSize="14px" color="rgba(255,255,255,0.42)"
                  lineHeight={1.7} mb={7}>
                  {p.desc}
                </Text>

                <Button variant={p.variant} w="full" size="md" py={6} fontSize="15px" mb={7}>
                  {p.cta}
                </Button>

                <Divider borderColor="rgba(255,255,255,0.07)" mb={6} />

                <VStack spacing={3} align="flex-start">
                  {p.features.map((f, j) => (
                    <HStack key={j} spacing={3}>
                      <Icon as={CheckCircleSolid} color={p.highlight ? "brand.lime" : "rgba(255,255,255,0.3)"} w={4} h={4} flexShrink={0} />
                      <Text fontFamily="'DM Sans', sans-serif" fontSize="14px" color="rgba(255,255,255,0.6)">{f}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </ScrollReveal>
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
    <Box as="section" py={40} px={6} textAlign="center" position="relative" overflow="hidden">
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)"
        w="900px" h="500px" pointerEvents="none"
        bg="radial-gradient(ellipse, rgba(200,241,53,0.09) 0%, transparent 65%)" />

      <Container maxW="800px">
        <ScrollReveal>
          <Text fontFamily="'Space Mono', monospace" fontSize="11px" letterSpacing=".12em"
            color="brand.lime" textTransform="uppercase" mb={8}>
            // Ready to Prove Yourself?
          </Text>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <Heading fontFamily="'Bebas Neue', sans-serif" fontWeight={400}
            fontSize={{ base: "4rem", md: "7rem", lg: "9rem" }}
            lineHeight={0.93} letterSpacing="-0.02em" mb={8}>
            YOUR CODE.
            <br />
            <Box as="span" color="brand.lime">YOUR CAREER.</Box>
          </Heading>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <Text fontFamily="'Instrument Serif', serif" fontStyle="italic" fontSize={{ base: "1.2rem", md: "1.6rem" }}
            color="rgba(255,255,255,0.38)" mb={12} lineHeight={1.6}>
            "LeetCode + AI mentor + hiring platform + no résumés."
          </Text>
        </ScrollReveal>

        <ScrollReveal delay={1.5}>
          <HStack spacing={5} justify="center" wrap="wrap">
            <Button variant="lime" size="lg" px={10} py={7} fontSize="17px">
              Start Solving — It's Free
            </Button>
            <Button variant="ghost_white" size="lg" px={10} py={7} fontSize="17px">
              Book Recruiter Demo
            </Button>
          </HStack>
        </ScrollReveal>
      </Container>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <Box as="footer" borderTop="1px solid rgba(255,255,255,0.06)" py={16} px={6}>
      <Container maxW="1280px">
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr 1fr" }} gap={10} mb={12}>
          <Box>
            <HStack spacing={3} mb={4}>
              <Box w={8} h={8} bg="brand.lime" borderRadius={8} display="flex" alignItems="center" justifyContent="center">
                <Icon as={CpuChipIcon} color="brand.ink" w={5} h={5} />
              </Box>
              <Text fontFamily="'Cabinet Grotesk', sans-serif" fontWeight={900} fontSize="18px" letterSpacing="-0.03em">
                SkillProof
              </Text>
            </HStack>
            <Text fontFamily="'DM Sans', sans-serif" fontSize="14px" color="rgba(255,255,255,0.38)"
              lineHeight={1.8} maxW="260px">
              The platform that hires on skill, not résumés. Blind evaluation powered by AI.
            </Text>
          </Box>

          {[
            { title: "Platform", links: ["How It Works", "AI Mentor", "Ghost Replay", "Pricing"] },
            { title: "Recruiters", links: ["Dashboard", "Candidate Ranking", "Integrations", "Enterprise"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Privacy"] },
          ].map((col, i) => (
            <Box key={i}>
              <Text fontFamily="'Syne', sans-serif" fontWeight={700} fontSize="13px"
                color="rgba(255,255,255,0.5)" textTransform="uppercase" letterSpacing=".06em" mb={4}>
                {col.title}
              </Text>
              <VStack spacing={3} align="flex-start">
                {col.links.map(l => (
                  <Text key={l} as="a" href="#" fontFamily="'DM Sans', sans-serif" fontSize="14px"
                    color="rgba(255,255,255,0.38)" _hover={{ color: "#fff" }} transition="color .2s" textDecoration="none">
                    {l}
                  </Text>
                ))}
              </VStack>
            </Box>
          ))}
        </Grid>

        <Divider borderColor="rgba(255,255,255,0.06)" mb={8} />

        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Text fontFamily="'Space Mono', monospace" fontSize="11px" color="rgba(255,255,255,0.22)">
            © 2026 SkillProof Inc. All rights reserved.
          </Text>
          <Text fontFamily="'Space Mono', monospace" fontSize="11px" color="rgba(255,255,255,0.22)">
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
        <Features />
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