"use client";

/**
 * SkillProof — Premium 2026 Login Page
 * ─────────────────────────────────────────────────────────────────────────────
 * Design: Asymmetric split-panel. Left = immersive dark brand panel with
 *         animated code canvas + floating merit stats. Right = ultra-clean
 *         glass-morphic form on matte obsidian.
 *
 * Fonts:
 *   1. Bebas Neue        — hero numerals & display
 *   2. Instrument Serif  — italic editorial accent
 *   3. Syne              — headings / labels
 *   4. DM Sans           — body / input text
 *   5. Space Mono        — mono badges / status
 *   6. Cabinet Grotesk   — CTAs / buttons
 *
 * Stack: Chakra UI v2 · Heroicons · Framer Motion · TypeScript
 *
 * Add to index.html <head>:
 *   <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
 *   <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap" rel="stylesheet">
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
  Text,
  VStack,
  ChakraProvider,
  extendTheme,
  chakra,
  Tag,
} from "@chakra-ui/react";
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  BoltIcon,
  TrophyIcon,
  CodeBracketIcon,
  SparklesIcon,
  UserGroupIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

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
    },
  },
  fonts: {
    heading: "'Syne', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'Space Mono', monospace",
  },
  styles: {
    global: {
      "html, body": { bg: "#0A0A0F", color: "#FAFAF7", overflowX: "hidden" },
      "::selection": { background: "#C8F135", color: "#0A0A0F" },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: "'Cabinet Grotesk', sans-serif",
        fontWeight: 800,
        letterSpacing: "-0.01em",
        borderRadius: "12px",
      },
      variants: {
        lime: {
          bg: "#C8F135",
          color: "#0A0A0F",
          _hover: { bg: "#b5dc1f", transform: "translateY(-1px)" },
          transition: "all 0.2s",
        },
        ghost_white: {
          bg: "transparent",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.12)",
          _hover: { bg: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.3)" },
          transition: "all 0.2s",
        },
      },
    },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. GLOBAL CSS
// ─────────────────────────────────────────────────────────────────────────────
function GlobalCSS() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Space+Mono:wght@400;700&display=swap');
      @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');

      @keyframes pulseLime{0%,100%{box-shadow:0 0 0 0 rgba(200,241,53,.4)}50%{box-shadow:0 0 0 12px rgba(200,241,53,0)}}
      @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes floatY2{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      @keyframes scanline{0%{top:-8%}100%{top:108%}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      @keyframes gradFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes codeScroll{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}
      @keyframes shimmer{0%{opacity:.4}50%{opacity:1}100%{opacity:.4}}
      @keyframes dotPulse{0%,80%,100%{transform:scale(0);opacity:0}40%{transform:scale(1);opacity:1}}

      .float-a { animation: floatY 5s ease-in-out infinite; }
      .float-b { animation: floatY2 6s 1s ease-in-out infinite; }
      .float-c { animation: floatY 4.5s 2s ease-in-out infinite; }
      .grain-overlay{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:180px}
      .cursor-blink{display:inline-block;width:2px;height:.75em;background:#C8F135;margin-left:3px;vertical-align:middle;animation:blink .85s step-end infinite}
      .code-scroll-track{animation:codeScroll 20s linear infinite}
      .dot-a{animation:dotPulse 1.4s ease-in-out .0s infinite}
      .dot-b{animation:dotPulse 1.4s ease-in-out .2s infinite}
      .dot-c{animation:dotPulse 1.4s ease-in-out .4s infinite}

      .input-field {
        width: 100%;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 12px;
        color: #FAFAF7;
        font-family: 'DM Sans', sans-serif;
        font-size: 15px;
        font-weight: 400;
        padding: 14px 48px 14px 44px;
        outline: none;
        transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        -webkit-font-smoothing: antialiased;
      }
      .input-field::placeholder { color: rgba(255,255,255,0.22); }
      .input-field:hover {
        background: rgba(255,255,255,0.06);
        border-color: rgba(255,255,255,0.18);
      }
      .input-field:focus {
        background: rgba(255,255,255,0.08);
        border-color: #C8F135;
        box-shadow: 0 0 0 2px rgba(200,241,53,0.18), 0 0 20px rgba(200,241,53,0.06);
      }
      .input-field.error {
        border-color: rgba(255,77,109,0.5);
        box-shadow: 0 0 0 2px rgba(255,77,109,0.12);
      }

      .btn-lime {
        width: 100%;
        background: #C8F135;
        color: #0A0A0F;
        border: none;
        border-radius: 12px;
        padding: 15px 24px;
        font-family: 'Cabinet Grotesk', sans-serif;
        font-size: 16px;
        font-weight: 800;
        letter-spacing: -0.01em;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: transform 0.15s, background 0.15s, box-shadow 0.2s;
      }
      .btn-lime:hover:not(:disabled) {
        background: #b5dc1f;
        transform: translateY(-1px);
        box-shadow: 0 8px 30px rgba(200,241,53,0.28);
      }
      .btn-lime:active:not(:disabled) { transform: translateY(0); }
      .btn-lime:disabled { opacity: 0.55; cursor: not-allowed; }

      .social-btn {
        flex: 1;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.09);
        border-radius: 12px;
        color: rgba(255,255,255,0.65);
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        font-weight: 500;
        padding: 12px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s;
      }
      .social-btn:hover {
        background: rgba(255,255,255,0.08);
        border-color: rgba(255,255,255,0.2);
        color: #fff;
      }

      .check-custom {
        width: 18px; height: 18px;
        border: 1.5px solid rgba(255,255,255,0.2);
        border-radius: 5px;
        background: rgba(255,255,255,0.03);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; transition: all 0.15s; flex-shrink: 0;
      }
      .check-custom.checked {
        background: #C8F135;
        border-color: #C8F135;
      }
    `;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ANIMATED CODE PANEL  (left side)
// ─────────────────────────────────────────────────────────────────────────────
const CODE_LINES = [
  { txt: "// SkillProof evaluation engine", color: "rgba(255,255,255,0.25)" },
  { txt: "import { evaluate } from '@skillproof/ai';", color: "rgba(200,241,53,0.7)" },
  { txt: "", color: "" },
  { txt: "async function scoreCandidate(session) {", color: "rgba(255,255,255,0.6)" },
  { txt: "  const { code, replay, hints } = session;", color: "rgba(255,255,255,0.45)" },
  { txt: "  const identity = hash(session.userId);", color: "rgba(124,58,237,0.9)" },
  { txt: "", color: "" },
  { txt: "  // blind evaluation — no bias", color: "rgba(255,255,255,0.25)" },
  { txt: "  const score = await evaluate({", color: "rgba(255,255,255,0.6)" },
  { txt: "    correctness:   0.35,", color: "rgba(200,241,53,0.6)" },
  { txt: "    efficiency:    0.25,", color: "rgba(200,241,53,0.6)" },
  { txt: "    readability:   0.20,", color: "rgba(200,241,53,0.6)" },
  { txt: "    thinking:      0.20,", color: "rgba(200,241,53,0.6)" },
  { txt: "    identity: null  // hidden", color: "rgba(255,77,109,0.7)" },
  { txt: "  });", color: "rgba(255,255,255,0.6)" },
  { txt: "", color: "" },
  { txt: "  if (score >= MERIT_THRESHOLD) {", color: "rgba(255,255,255,0.55)" },
  { txt: "    reveal(identity);  // earned it", color: "rgba(74,222,128,0.8)" },
  { txt: "  }", color: "rgba(255,255,255,0.55)" },
  { txt: "  return { score, replay };", color: "rgba(255,255,255,0.45)" },
  { txt: "}", color: "rgba(255,255,255,0.6)" },
  { txt: "", color: "" },
  { txt: "// Ghost Replay timeline", color: "rgba(255,255,255,0.25)" },
  { txt: "const replay = ghostReplay(session);", color: "rgba(124,58,237,0.8)" },
  { txt: "const ranked = leaderboard.sort(", color: "rgba(255,255,255,0.5)" },
  { txt: "  (a, b) => b.score - a.score", color: "rgba(200,241,53,0.55)" },
  { txt: ");", color: "rgba(255,255,255,0.5)" },
];

function CodePanel() {
  const doubled = [...CODE_LINES, ...CODE_LINES];

  return (
    <Box
      position="relative"
      h="100%"
      overflow="hidden"
      bg="#0D0D12"
      borderRight="1px solid rgba(255,255,255,0.05)"
    >
      {/* Scanline effect */}
      <Box
        position="absolute"
        left={0}
        right={0}
        h="120px"
        bg="linear-gradient(to bottom, transparent, rgba(200,241,53,0.025), transparent)"
        pointerEvents="none"
        zIndex={3}
        style={{ animation: "scanline 5s linear infinite" }}
      />

      {/* Top gradient fade */}
      <Box
        position="absolute"
        top={0} left={0} right={0} h="140px"
        bg="linear-gradient(to bottom, #0D0D12, transparent)"
        zIndex={4} pointerEvents="none"
      />
      {/* Bottom gradient fade */}
      <Box
        position="absolute"
        bottom={0} left={0} right={0} h="200px"
        bg="linear-gradient(to top, #0D0D12, transparent)"
        zIndex={4} pointerEvents="none"
      />

      {/* Left glow accent */}
      <Box
        position="absolute"
        top="30%" left={0}
        w="2px" h="40%"
        bg="linear-gradient(to bottom, transparent, #C8F135, transparent)"
        opacity={0.6}
        zIndex={5}
      />

      {/* Code lines */}
      <Box
        position="absolute"
        top={0} left={0} right={0}
        pt={20} px={8}
        className="code-scroll-track"
      >
        {doubled.map((line, i) => (
          <Box key={i} h="26px" display="flex" alignItems="center">
            <Text
              fontFamily="'Space Mono', monospace"
              fontSize="13px"
              lineHeight="26px"
              color={line.color || "transparent"}
              whiteSpace="pre"
              style={{ textShadow: line.color?.includes("200,241") ? "0 0 12px rgba(200,241,53,0.25)" : "none" }}
            >
              {line.txt || " "}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Brand overlay — bottom left */}
      <Box
        position="absolute"
        bottom={0} left={0} right={0}
        p={10}
        zIndex={6}
        bg="linear-gradient(to top, rgba(13,13,18,0.98) 0%, rgba(13,13,18,0.7) 60%, transparent 100%)"
      >
        {/* Logo */}
        <HStack spacing={3} mb={8}>
          <Box
            w={9} h={9} bg="brand.lime" borderRadius={9}
            display="flex" alignItems="center" justifyContent="center"
          >
            <Icon as={CpuChipIcon} color="#0A0A0F" w={5} h={5} />
          </Box>
          <Text
            fontFamily="'Cabinet Grotesk', sans-serif"
            fontWeight={900} fontSize="20px" letterSpacing="-0.03em"
          >
            SkillProof
          </Text>
        </HStack>

        {/* Big headline */}
        <Text
          fontFamily="'Bebas Neue', sans-serif"
          fontSize={{ base: "3.2rem", xl: "4.5rem" }}
          lineHeight={0.95}
          letterSpacing="-0.02em"
          mb={4}
        >
          CODE SPEAKS.
          <br />
          <Box as="span" color="brand.lime">
            RÉSUMÉS DON'T.
          </Box>
        </Text>

        <Text
          fontFamily="'Instrument Serif', serif"
          fontStyle="italic"
          fontSize="16px"
          color="rgba(255,255,255,0.38)"
          lineHeight={1.65}
          maxW="340px"
          mb={8}
        >
          "The only hiring platform that evaluates your thinking, not your background."
        </Text>

        {/* Stat chips row */}
        <HStack spacing={3} flexWrap="wrap">
          {[
            { val: "2,400+", label: "Devs active", color: "#C8F135" },
            { val: "0%", label: "Bias", color: "#7C3AED" },
            { val: "3.2×", label: "Hire quality", color: "#4ADE80" },
          ].map((s, i) => (
            <Box
              key={i}
              bg="rgba(255,255,255,0.05)"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255,255,255,0.08)"
              borderRadius="12px"
              px={4} py={3}
            >
              <Text
                fontFamily="'Bebas Neue', sans-serif"
                fontSize="22px"
                color={s.color}
                lineHeight={1}
                letterSpacing="-0.02em"
              >
                {s.val}
              </Text>
              <Text
                fontFamily="'Space Mono', monospace"
                fontSize="9px"
                color="rgba(255,255,255,0.35)"
                textTransform="uppercase"
                letterSpacing=".06em"
                mt="2px"
              >
                {s.label}
              </Text>
            </Box>
          ))}
        </HStack>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FLOATING AMBIENT CHIPS
// ─────────────────────────────────────────────────────────────────────────────
function Chip({ className, style, children }: { className?: string; style?: React.CSSProperties; children: ReactNode }) {
  return (
    <Box
      className={className}
      position="absolute"
      bg="rgba(22,22,30,0.85)"
      backdropFilter="blur(16px)"
      border="1px solid rgba(255,255,255,0.09)"
      borderRadius="16px"
      px={4} py="10px"
      display={{ base: "none", "2xl": "flex" }}
      alignItems="center"
      gap={2}
      pointerEvents="none"
      zIndex={10}
      style={style}
    >
      {children}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LOADING DOTS
// ─────────────────────────────────────────────────────────────────────────────
function LoadingDots() {
  return (
    <HStack spacing="4px">
      {["dot-a", "dot-b", "dot-c"].map(cls => (
        <Box key={cls} className={cls} w="5px" h="5px" borderRadius="full" bg="#0A0A0F" />
      ))}
    </HStack>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CUSTOM INPUT
// ─────────────────────────────────────────────────────────────────────────────
function Field({
  label,
  id,
  type,
  placeholder,
  value,
  onChange,
  icon,
  rightEl,
  error,
  disabled,
  hint,
}: {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon: any;
  rightEl?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  hint?: ReactNode;
}) {
  return (
    <Box position="relative">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="8px">
        <Text
          as="label"
          htmlFor={id}
          fontFamily="'Space Mono', monospace"
          fontSize="10px"
          letterSpacing=".1em"
          color="rgba(255,255,255,0.38)"
          textTransform="uppercase"
          display="block"
        >
          {label}
        </Text>
        {hint}
      </Box>
      <Box position="relative">
        <Box
          position="absolute"
          left="14px"
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          pointerEvents="none"
        >
          <Icon as={icon} w="16px" h="16px" color="rgba(255,255,255,0.28)" />
        </Box>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className={`input-field${error ? " error" : ""}`}
          style={{ paddingRight: rightEl ? "44px" : "14px" }}
          autoComplete={type === "email" ? "email" : "current-password"}
        />
        {rightEl && (
          <Box
            position="absolute"
            right="12px"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
          >
            {rightEl}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MAIN LOGIN FORM
// ─────────────────────────────────────────────────────────────────────────────
type LoginResponse = {
  user: { email: string; name?: string | null; role?: string };
  token: string;
};

const MotionBox = motion(Box as any);

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (email || password) setError(null); }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setSubmitting(true);
    setError(null);
    try {
      // Replace with real API call:
      // const result = await fetchJson<LoginResponse>("/api/auth/login", { method:"POST", body:{ email, password } });
      await new Promise(r => setTimeout(r, 1600)); // demo delay
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err: any) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MotionBox
      as="form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      w="full"
      maxW="440px"
    >
      {/* Card */}
      <Box
        bg="rgba(22,22,30,0.7)"
        backdropFilter="blur(24px)"
        border="1px solid rgba(255,255,255,0.08)"
        borderRadius="28px"
        p={{ base: 7, md: 9 }}
        position="relative"
        overflow="hidden"
      >
        {/* Subtle lime glow top-right */}
        <Box
          position="absolute" top={0} right={0}
          w="200px" h="200px"
          bg="radial-gradient(circle, rgba(200,241,53,0.05) 0%, transparent 70%)"
          pointerEvents="none"
        />

        {/* Header */}
        <VStack spacing={1} mb={8} align="flex-start">
          <HStack spacing={2} mb={4}>
            <Box
              w={8} h={8} bg="rgba(200,241,53,0.12)" borderRadius={8}
              display="flex" alignItems="center" justifyContent="center"
              border="1px solid rgba(200,241,53,0.2)"
            >
              <Icon as={CpuChipIcon} color="brand.lime" w={4} h={4} />
            </Box>
            <Text
              fontFamily="'Space Mono', monospace"
              fontSize="11px"
              color="rgba(255,255,255,0.3)"
              letterSpacing=".06em"
            >
              SKILLPROOF · AUTH
            </Text>
          </HStack>

          <Heading
            fontFamily="'Bebas Neue', sans-serif"
            fontWeight={400}
            fontSize="3rem"
            letterSpacing="-0.02em"
            lineHeight={0.95}
          >
            WELCOME
            <br />
            <Box as="span" color="brand.lime">BACK.</Box>
          </Heading>
          <Text
            fontFamily="'Instrument Serif', serif"
            fontStyle="italic"
            fontSize="15px"
            color="rgba(255,255,255,0.35)"
            mt={2}
          >
            Sign in to access your merit dashboard
          </Text>
        </VStack>

        {/* Social sign-in */}
        <Box display="flex" gap={3} mb={6}>
          {[
            {
              label: "GitHub",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              ),
            },
            {
              label: "Google",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              ),
            },
          ].map(s => (
            <button key={s.label} type="button" className="social-btn">
              {s.icon}
              <span>Continue with {s.label}</span>
            </button>
          ))}
        </Box>

        {/* Divider */}
        <Box display="flex" alignItems="center" gap={3} mb={6}>
          <Box flex={1} h="1px" bg="rgba(255,255,255,0.07)" />
          <Text
            fontFamily="'Space Mono', monospace"
            fontSize="10px"
            color="rgba(255,255,255,0.22)"
            letterSpacing=".08em"
          >
            OR
          </Text>
          <Box flex={1} h="1px" bg="rgba(255,255,255,0.07)" />
        </Box>

        {/* Fields */}
        <VStack spacing={4} mb={5}>
          <Box w="full">
            <Field
              label="Email address"
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={setEmail}
              icon={EnvelopeIcon}
              error={!!error && !email}
              disabled={submitting}
            />
          </Box>

          <Box w="full">
            <Field
              label="Password"
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={setPassword}
              icon={LockClosedIcon}
              error={!!error && !password}
              disabled={submitting}
              hint={
                <NextLink href="/forgot-password" style={{ textDecoration: "none" }}>
                  <Text
                    fontFamily="'Space Mono', monospace"
                    fontSize="10px"
                    color="brand.lime"
                    letterSpacing=".06em"
                    _hover={{ opacity: 0.75 }}
                    cursor="pointer"
                    transition="opacity 0.15s"
                  >
                    FORGOT?
                  </Text>
                </NextLink>
              }
              rightEl={
                <Box
                  as="button"
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  p={0}
                  display="flex"
                  alignItems="center"
                >
                  <Icon
                    as={showPw ? EyeSlashIcon : EyeIcon}
                    w="16px" h="16px"
                    color="rgba(255,255,255,0.28)"
                  />
                </Box>
              }
            />
          </Box>
        </VStack>

        {/* Remember me */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={6}>
          <Box
            as="button"
            type="button"
            display="flex"
            alignItems="center"
            gap={2}
            bg="transparent"
            border="none"
            cursor="pointer"
            onClick={() => setRemember(r => !r)}
          >
            <Box className={`check-custom${remember ? " checked" : ""}`}>
              {remember && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5.5L4 7.5L8 3" stroke="#0A0A0F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </Box>
            <Text
              fontFamily="'DM Sans', sans-serif"
              fontSize="13px"
              color="rgba(255,255,255,0.5)"
            >
              Keep me signed in
            </Text>
          </Box>
          <HStack spacing="6px">
            <Box w="6px" h="6px" borderRadius="full" bg="brand.lime" animation="pulseLime 2s infinite" />
            <Text
              fontFamily="'Space Mono', monospace"
              fontSize="10px"
              color="rgba(255,255,255,0.22)"
            >
              SSL secured
            </Text>
          </HStack>
        </Box>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <MotionBox
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: "20px" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              overflow="hidden"
            >
              <Box
                bg="rgba(255,77,109,0.08)"
                border="1px solid rgba(255,77,109,0.25)"
                borderRadius="12px"
                px={4} py={3}
                display="flex"
                alignItems="center"
                gap={3}
              >
                <Box
                  w="6px" h="6px" borderRadius="full"
                  bg="#FF4D6D" flexShrink={0}
                />
                <Text
                  fontFamily="'DM Sans', sans-serif"
                  fontSize="13px"
                  color="#FF4D6D"
                >
                  {error}
                </Text>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          className="btn-lime"
          disabled={submitting || success}
        >
          {submitting ? (
            <LoadingDots />
          ) : success ? (
            <>
              <Icon as={CheckCircleSolid} w={5} h={5} />
              Redirecting…
            </>
          ) : (
            <>
              Continue
              <Icon as={ArrowRightIcon} w={4} h={4} />
            </>
          )}
        </button>

        {/* Footer links */}
        <Box mt={7} pt={6} borderTop="1px solid rgba(255,255,255,0.06)">
          <Text
            fontFamily="'DM Sans', sans-serif"
            fontSize="14px"
            color="rgba(255,255,255,0.38)"
            textAlign="center"
          >
            No account?{" "}
            <NextLink href="/register" style={{ textDecoration: "none" }}>
              <Box
                as="span"
                color="brand.lime"
                fontWeight={600}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
                transition="opacity 0.15s"
              >
                Create one — it's free
              </Box>
            </NextLink>
          </Text>
        </Box>
      </Box>

      {/* Trust badges below card */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <HStack spacing={5} justify="center" mt={6} flexWrap="wrap">
          {[
            { icon: ShieldCheckIcon, label: "SOC 2 compliant" },
            { icon: LockClosedIcon, label: "End-to-end encrypted" },
            { icon: FingerPrintIconLocal, label: "Zero-knowledge identity" },
          ].map((b, i) => (
            <HStack key={i} spacing={2}>
              <Icon as={b.icon} w="13px" h="13px" color="rgba(255,255,255,0.22)" />
              <Text
                fontFamily="'Space Mono', monospace"
                fontSize="10px"
                color="rgba(255,255,255,0.22)"
                letterSpacing=".04em"
              >
                {b.label}
              </Text>
            </HStack>
          ))}
        </HStack>
      </MotionBox>
    </MotionBox>
  );
}

// tiny local icon wrapper to avoid import issues
function FingerPrintIconLocal(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <ChakraProvider theme={theme}>
      <GlobalCSS />
      <div className="grain-overlay" />

      <Box minH="100vh" display="flex" position="relative">

        {/* ── LEFT PANEL: Brand / Code ── */}
        <Box
          display={{ base: "none", lg: "flex" }}
          w={{ lg: "48%", xl: "52%" }}
          minH="100vh"
          position="relative"
          flexShrink={0}
        >
          <CodePanel />

          {/* Floating ambient chips on left panel */}
          <Chip className="float-a" style={{ top: "12%", right: "-20px" }}>
            <Icon as={SparklesIcon} color="#C8F135" w="14px" h="14px" />
            <Text fontFamily="'Space Mono', monospace" fontSize="10px" color="rgba(255,255,255,0.6)">AI Mentor active</Text>
          </Chip>

          <Chip className="float-b" style={{ top: "38%", right: "-24px" }}>
            <Box w="6px" h="6px" borderRadius="full" bg="#4ADE80" animation="pulseLime 2.2s infinite" />
            <Text fontFamily="'Space Mono', monospace" fontSize="10px" color="rgba(255,255,255,0.55)">Score: 94/100</Text>
          </Chip>

          <Chip className="float-c" style={{ bottom: "28%", right: "-20px" }}>
            <Icon as={TrophyIcon} color="#F59E0B" w="14px" h="14px" />
            <Text fontFamily="'Space Mono', monospace" fontSize="10px" color="rgba(255,255,255,0.55)">Rank #1 unlocked</Text>
          </Chip>
        </Box>

        {/* ── RIGHT PANEL: Form ── */}
        <Box
          flex={1}
          minH="100vh"
          display="flex"
          flexDir="column"
          bg="#0A0A0F"
          position="relative"
          overflow="hidden"
        >
          {/* Radial glow */}
          <Box
            position="absolute"
            top="40%" left="50%" transform="translate(-50%, -50%)"
            w="600px" h="600px"
            bg="radial-gradient(ellipse, rgba(200,241,53,0.055) 0%, transparent 68%)"
            pointerEvents="none"
          />
          <Box
            position="absolute"
            bottom="5%" right="5%"
            w="300px" h="300px"
            bg="radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 68%)"
            pointerEvents="none"
          />

          {/* Top nav */}
          <Flex
            justify="space-between"
            align="center"
            px={{ base: 6, md: 10 }}
            py={6}
            position="relative"
            zIndex={5}
          >
            <NextLink href="/" style={{ textDecoration: "none" }}>
              <HStack spacing={2} cursor="pointer" opacity={0.6}
                _hover={{ opacity: 1 }} transition="opacity 0.2s"
              >
                <Icon as={ArrowLeftIcon} w={4} h={4} color="rgba(255,255,255,0.5)" />
                <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="rgba(255,255,255,0.5)">
                  Back to site
                </Text>
              </HStack>
            </NextLink>

            <NextLink href="/register" style={{ textDecoration: "none" }}>
              <HStack spacing={2}>
                <Text fontFamily="'DM Sans', sans-serif" fontSize="13px" color="rgba(255,255,255,0.4)">
                  New here?
                </Text>
                <Box
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(255,255,255,0.1)"
                  borderRadius="8px"
                  px={3} py="6px"
                  cursor="pointer"
                  _hover={{ borderColor: "rgba(255,255,255,0.25)", bg: "rgba(255,255,255,0.08)" }}
                  transition="all 0.2s"
                >
                  <Text fontFamily="'Cabinet Grotesk', sans-serif" fontWeight={700} fontSize="13px">
                    Create account →
                  </Text>
                </Box>
              </HStack>
            </NextLink>
          </Flex>

          {/* Centered form */}
          <Flex
            flex={1}
            align="center"
            justify="center"
            px={{ base: 5, md: 10 }}
            py={8}
            position="relative"
            zIndex={5}
          >
            <LoginForm />
          </Flex>

          {/* Bottom footer */}
          <Flex
            justify="center"
            gap={6}
            pb={8}
            px={6}
            flexWrap="wrap"
            position="relative"
            zIndex={5}
          >
            {["Privacy Policy", "Terms", "Security", "Help"].map(l => (
              <Text
                key={l}
                as="a"
                href="#"
                fontFamily="'Space Mono', monospace"
                fontSize="10px"
                color="rgba(255,255,255,0.2)"
                letterSpacing=".04em"
                textDecoration="none"
                _hover={{ color: "rgba(255,255,255,0.45)" }}
                transition="color 0.2s"
              >
                {l}
              </Text>
            ))}
          </Flex>
        </Box>
      </Box>
    </ChakraProvider>
  );
}