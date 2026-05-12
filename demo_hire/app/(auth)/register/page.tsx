'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Flex,
  Text,
  Heading,
  HStack,
  VStack,
  Icon,
  ChakraProvider,
  extendTheme,
  Input,
  useToast,
  Select,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  UserIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Magic UI Components
import { Meteors } from '@/components/ui/meteors';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { Spotlight } from '@/components/ui/spotlight-new';
import { NoiseTexture } from '@/components/ui/noise-texture';
import { FlickeringGrid } from '@/components/ui/flickering-grid';

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.08; }
`;

// Theme
const theme = extendTheme({
  config: { initialColorMode: 'dark', useSystemColorMode: false },
  colors: {
    brand: {
      lime: '#C8F135',
      violet: '#7C3AED',
      red: '#FF4D6D',
      ink: '#0A0A0F',
    },
  },
  fonts: {
    heading: "'Syne', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'Space Mono', monospace",
  },
  styles: {
    global: {
      'html, body': { bg: '#0A0A0F', color: '#FAFAF7', overflowX: 'hidden' },
      '::selection': { background: '#C8F135', color: '#0A0A0F' },
    },
  },
});

// Global CSS for fonts
function GlobalCSS() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=Space+Mono:wght@400;700&display=swap');
      @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap');
      
      .grain-overlay {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        opacity: 0.025;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 180px;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'recruiter' | 'candidate'>('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      localStorage.setItem('userRole', role);

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      toast({
        title: 'Welcome aboard!',
        description: 'Account created successfully',
        status: 'success',
        duration: 2000,
      });

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      toast({
        title: 'Registration failed',
        description: err.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <GlobalCSS />
      <div className="grain-overlay" />

      {/* Background Layers */}
      <Box position="fixed" inset={0} zIndex={0} pointerEvents="none">
        <Meteors number={25} />
      </Box>

      <Box
        position="fixed"
        inset={0}
        zIndex={0}
        pointerEvents="none"
        opacity={0.25}
      >
        <BackgroundBeams />
      </Box>

      <Box position="fixed" inset={0} zIndex={0} pointerEvents="none">
        <Spotlight />
      </Box>

      {/* MAIN CONTAINER */}
      <Box
        display="flex"
        flexDir={{ base: 'column', lg: 'row' }}
        minH="100vh"
        position="relative"
        zIndex={10}
      >
        {/* LEFT PANEL - Brand Side */}
        <Box
          display={{ base: 'none', lg: 'flex' }}
          flex="1"
          position="relative"
          minH="100vh"
          bg="#0D0D12"
        >
          <Box
            position="absolute"
            inset={0}
            bgImage="url(/hi.png)"
            bgSize="cover"
            bgPosition="center"
            filter="brightness(0.35)"
          />

          <Box
            position="absolute"
            inset={0}
            zIndex={0}
            pointerEvents="none"
            opacity={0.5}
          >
            <NoiseTexture opacity={0.04} />
          </Box>

          <Box position="absolute" bottom={12} left={8} right={8} zIndex={2}>
            <HStack spacing={3} mb={6}>
              <Box
                w={10}
                h={10}
                bg="#C8F135"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <CpuChipIcon className="w-5 h-5 text-black" />
              </Box>
              <Text
                fontFamily="'Cabinet Grotesk', sans-serif"
                fontWeight={900}
                fontSize="xl"
                color="white"
              >
                SkillProof
              </Text>
            </HStack>

            <Text
              fontFamily="'Bebas Neue', sans-serif"
              fontSize={{ base: '3rem', xl: '4rem' }}
              lineHeight={0.95}
              mb={4}
              color="white"
            >
              START YOUR
              <br />
              <Box as="span" color="#C8F135">
                MERIT JOURNEY.
              </Box>
            </Text>

            <Text
              fontFamily="'Instrument Serif', serif"
              fontStyle="italic"
              fontSize="lg"
              color="rgba(255,255,255,0.6)"
              maxW="md"
              mb={8}
            >
              "Join the platform that evaluates your thinking, not your
              background."
            </Text>

            <HStack spacing={4}>
              {[
                { val: '2,400+', label: 'Devs active', color: '#C8F135' },
                { val: '0%', label: 'Bias', color: '#7C3AED' },
                { val: '3.2×', label: 'Hire quality', color: '#4ADE80' },
              ].map((stat, idx) => (
                <Box
                  key={idx}
                  bg="rgba(0,0,0,0.6)"
                  backdropFilter="blur(10px)"
                  border="1px solid rgba(255,255,255,0.1)"
                  borderRadius="xl"
                  px={4}
                  py={2}
                >
                  <Text
                    fontFamily="'Bebas Neue', sans-serif"
                    fontSize="2xl"
                    color={stat.color}
                    lineHeight={1}
                  >
                    {stat.val}
                  </Text>
                  <Text
                    fontFamily="'Space Mono', monospace"
                    fontSize="xs"
                    color="rgba(255,255,255,0.5)"
                    textTransform="uppercase"
                  >
                    {stat.label}
                  </Text>
                </Box>
              ))}
            </HStack>
          </Box>
        </Box>

        {/* RIGHT PANEL - Form Side */}
        <Box
          flex="1"
          minH="100vh"
          display="flex"
          flexDir="column"
          bg="#0A0A0F"
          position="relative"
        >
          {/* Dotted/Flickering Grid Background */}
          <Box
            position="absolute"
            inset={0}
            zIndex={0}
            pointerEvents="none"
            opacity={0.15}
          >
            <FlickeringGrid
              squareSize={6}
              gridGap={8}
              flickerChance={0.3}
              color="#C8F135"
            />
          </Box>

          {/* Subtle Animated Background Gradient */}
          <Box
            position="absolute"
            inset={0}
            zIndex={0}
            bgGradient="radial-gradient(circle at 30% 40%, rgba(200,241,53,0.03), transparent 70%)"
            animation={`${pulseAnimation} 6s ease-in-out infinite`}
            pointerEvents="none"
          />

          {/* Noise Texture */}
          <Box
            position="absolute"
            inset={0}
            zIndex={0}
            pointerEvents="none"
            opacity={0.03}
          >
            <NoiseTexture />
          </Box>

          {/* Top Navigation */}
          <Flex
            justify="space-between"
            align="center"
            px={{ base: 6, md: 10 }}
            py={6}
            position="relative"
            zIndex={5}
          >
            <NextLink href="/" style={{ textDecoration: 'none' }}>
              <HStack
                spacing={2}
                cursor="pointer"
                opacity={0.6}
                _hover={{ opacity: 1 }}
                transition="opacity 0.2s"
              >
                <Icon
                  as={ArrowLeftIcon}
                  w={4}
                  h={4}
                  color="rgba(255,255,255,0.5)"
                />
                <Text
                  fontFamily="'DM Sans', sans-serif"
                  fontSize="sm"
                  color="rgba(255,255,255,0.5)"
                >
                  Back to site
                </Text>
              </HStack>
            </NextLink>

            <NextLink href="/login" style={{ textDecoration: 'none' }}>
              <HStack spacing={2}>
                <Text
                  fontFamily="'DM Sans', sans-serif"
                  fontSize="sm"
                  color="rgba(255,255,255,0.4)"
                >
                  Already have an account?
                </Text>
                <Box
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(255,255,255,0.1)"
                  borderRadius="lg"
                  px={3}
                  py="6px"
                  cursor="pointer"
                  _hover={{
                    borderColor: 'rgba(255,255,255,0.25)',
                    bg: 'rgba(255,255,255,0.08)',
                  }}
                  transition="all 0.2s"
                >
                  <Text
                    fontFamily="'Cabinet Grotesk', sans-serif"
                    fontWeight={700}
                    fontSize="sm"
                  >
                    Sign in →
                  </Text>
                </Box>
              </HStack>
            </NextLink>
          </Flex>

          {/* Centered Form */}
          <Flex
            flex={1}
            align="center"
            justify="center"
            px={{ base: 5, md: 10 }}
            py={8}
            position="relative"
            zIndex={5}
          >
            <Box w="full" maxW="480px">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Header */}
                <VStack spacing={1} mb={8} align="flex-start">
                  <Heading
                    fontFamily="'Bebas Neue', sans-serif"
                    fontWeight={400}
                    fontSize="3rem"
                    letterSpacing="-0.02em"
                    lineHeight={0.95}
                    color="white"
                  >
                    CREATE
                    <br />
                    <Box as="span" color="#C8F135">
                      ACCOUNT.
                    </Box>
                  </Heading>
                  <Text
                    fontFamily="'Instrument Serif', serif"
                    fontStyle="italic"
                    fontSize="15px"
                    color="rgba(255,255,255,0.4)"
                    mt={2}
                  >
                    Start your merit-based journey today
                  </Text>
                </VStack>

                {/* Social Sign-up */}
                <div className="flex gap-3 mb-6">
                  <HoverBorderGradient
                    containerClassName="flex-1 rounded-xl w-full"
                    as="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white transition-all"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub</span>
                  </HoverBorderGradient>

                  <HoverBorderGradient
                    containerClassName="flex-1 rounded-xl w-full"
                    as="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Google</span>
                  </HoverBorderGradient>
                </div>

                {/* Divider */}
                <Flex align="center" gap={3} mb={6}>
                  <Box flex={1} h="1px" bg="rgba(255,255,255,0.07)" />
                  <Text
                    fontFamily="'Space Mono', monospace"
                    fontSize="xs"
                    color="rgba(255,255,255,0.3)"
                    letterSpacing=".08em"
                  >
                    OR
                  </Text>
                  <Box flex={1} h="1px" bg="rgba(255,255,255,0.07)" />
                </Flex>

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                  <VStack spacing={5} mb={5}>
                    {/* Full Name Field */}
                    <Box w="full">
                      <Text
                        as="label"
                        htmlFor="name"
                        fontFamily="'Space Mono', monospace"
                        fontSize="xs"
                        letterSpacing=".1em"
                        color="rgba(255,255,255,0.5)"
                        textTransform="uppercase"
                        display="block"
                        mb={2}
                      >
                        FULL NAME
                      </Text>
                      <Box position="relative">
                        <Box
                          position="absolute"
                          left="14px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={2}
                          pointerEvents="none"
                        >
                          <UserIcon className="w-4 h-4 text-gray-500" />
                        </Box>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          bg="rgba(255,255,255,0.04)"
                          border="1px solid rgba(255,255,255,0.09)"
                          borderRadius="12px"
                          color="white"
                          h="52px"
                          pl="44px"
                          _placeholder={{ color: 'rgba(255,255,255,0.3)' }}
                          _hover={{
                            bg: 'rgba(255,255,255,0.06)',
                            borderColor: 'rgba(255,255,255,0.18)',
                          }}
                          _focus={{
                            bg: 'rgba(255,255,255,0.08)',
                            borderColor: '#C8F135',
                            boxShadow: '0 0 0 2px rgba(200,241,53,0.18)',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Email Field */}
                    <Box w="full">
                      <Text
                        as="label"
                        htmlFor="email"
                        fontFamily="'Space Mono', monospace"
                        fontSize="xs"
                        letterSpacing=".1em"
                        color="rgba(255,255,255,0.5)"
                        textTransform="uppercase"
                        display="block"
                        mb={2}
                      >
                        EMAIL ADDRESS
                      </Text>
                      <Box position="relative">
                        <Box
                          position="absolute"
                          left="14px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={2}
                          pointerEvents="none"
                        >
                          <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                        </Box>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          bg="rgba(255,255,255,0.04)"
                          border="1px solid rgba(255,255,255,0.09)"
                          borderRadius="12px"
                          color="white"
                          h="52px"
                          pl="44px"
                          _placeholder={{ color: 'rgba(255,255,255,0.3)' }}
                          _hover={{
                            bg: 'rgba(255,255,255,0.06)',
                            borderColor: 'rgba(255,255,255,0.18)',
                          }}
                          _focus={{
                            bg: 'rgba(255,255,255,0.08)',
                            borderColor: '#C8F135',
                            boxShadow: '0 0 0 2px rgba(200,241,53,0.18)',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Role Selection */}
                    <Box w="full">
                      <Text
                        as="label"
                        htmlFor="role"
                        fontFamily="'Space Mono', monospace"
                        fontSize="xs"
                        letterSpacing=".1em"
                        color="rgba(255,255,255,0.5)"
                        textTransform="uppercase"
                        display="block"
                        mb={2}
                      >
                        I AM A
                      </Text>
                      <Box position="relative">
                        <Box
                          position="absolute"
                          left="14px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={2}
                          pointerEvents="none"
                        >
                          <UserGroupIcon className="w-4 h-4 text-gray-500" />
                        </Box>
                        <Select
                          id="role"
                          value={role}
                          onChange={(e) =>
                            setRole(e.target.value as 'recruiter' | 'candidate')
                          }
                          bg="rgba(255,255,255,0.04)"
                          border="1px solid rgba(255,255,255,0.09)"
                          borderRadius="12px"
                          color="white"
                          h="52px"
                          pl="44px"
                          iconColor="rgba(255,255,255,0.5)"
                          _hover={{
                            bg: 'rgba(255,255,255,0.06)',
                            borderColor: 'rgba(255,255,255,0.18)',
                          }}
                          _focus={{
                            bg: 'rgba(255,255,255,0.08)',
                            borderColor: '#C8F135',
                            boxShadow: '0 0 0 2px rgba(200,241,53,0.18)',
                          }}
                        >
                          <option
                            value="candidate"
                            style={{ background: '#0A0A0F' }}
                          >
                            Candidate - I want to prove my skills
                          </option>
                          <option
                            value="recruiter"
                            style={{ background: '#0A0A0F' }}
                          >
                            Recruiter - I want to hire talent
                          </option>
                        </Select>
                      </Box>
                    </Box>

                    {/* Password Field */}
                    <Box w="full">
                      <Text
                        as="label"
                        htmlFor="password"
                        fontFamily="'Space Mono', monospace"
                        fontSize="xs"
                        letterSpacing=".1em"
                        color="rgba(255,255,255,0.5)"
                        textTransform="uppercase"
                        display="block"
                        mb={2}
                      >
                        PASSWORD
                      </Text>
                      <Box position="relative">
                        <Box
                          position="absolute"
                          left="14px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={2}
                          pointerEvents="none"
                        >
                          <LockClosedIcon className="w-4 h-4 text-gray-500" />
                        </Box>
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a strong password"
                          bg="rgba(255,255,255,0.04)"
                          border="1px solid rgba(255,255,255,0.09)"
                          borderRadius="12px"
                          color="white"
                          h="52px"
                          pl="44px"
                          pr="44px"
                          _placeholder={{ color: 'rgba(255,255,255,0.3)' }}
                          _hover={{
                            bg: 'rgba(255,255,255,0.06)',
                            borderColor: 'rgba(255,255,255,0.18)',
                          }}
                          _focus={{
                            bg: 'rgba(255,255,255,0.08)',
                            borderColor: '#C8F135',
                            boxShadow: '0 0 0 2px rgba(200,241,53,0.18)',
                          }}
                        />
                        <Box
                          position="absolute"
                          right="12px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={2}
                        >
                          <Box
                            as="button"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            bg="transparent"
                            border="none"
                            cursor="pointer"
                            p={0}
                            display="flex"
                            alignItems="center"
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="w-4 h-4 text-gray-500" />
                            ) : (
                              <EyeIcon className="w-4 h-4 text-gray-500" />
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Text
                        fontFamily="'DM Sans', sans-serif"
                        fontSize="xs"
                        color="rgba(255,255,255,0.3)"
                        mt={1}
                      >
                        Use at least 8 characters
                      </Text>
                    </Box>

                    {/* Confirm Password Field */}
                    <Box w="full">
                      <Text
                        as="label"
                        htmlFor="confirmPassword"
                        fontFamily="'Space Mono', monospace"
                        fontSize="xs"
                        letterSpacing=".1em"
                        color="rgba(255,255,255,0.5)"
                        textTransform="uppercase"
                        display="block"
                        mb={2}
                      >
                        CONFIRM PASSWORD
                      </Text>
                      <Box position="relative">
                        <Box
                          position="absolute"
                          left="14px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={2}
                          pointerEvents="none"
                        >
                          <LockClosedIcon className="w-4 h-4 text-gray-500" />
                        </Box>
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat your password"
                          bg="rgba(255,255,255,0.04)"
                          border="1px solid rgba(255,255,255,0.09)"
                          borderRadius="12px"
                          color="white"
                          h="52px"
                          pl="44px"
                          pr="44px"
                          _placeholder={{ color: 'rgba(255,255,255,0.3)' }}
                          _hover={{
                            bg: 'rgba(255,255,255,0.06)',
                            borderColor: 'rgba(255,255,255,0.18)',
                          }}
                          _focus={{
                            bg: 'rgba(255,255,255,0.08)',
                            borderColor: '#C8F135',
                            boxShadow: '0 0 0 2px rgba(200,241,53,0.18)',
                          }}
                        />
                        <Box
                          position="absolute"
                          right="12px"
                          top="50%"
                          transform="translateY(-50%)"
                          zIndex={2}
                        >
                          <Box
                            as="button"
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            bg="transparent"
                            border="none"
                            cursor="pointer"
                            p={0}
                            display="flex"
                            alignItems="center"
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon className="w-4 h-4 text-gray-500" />
                            ) : (
                              <EyeIcon className="w-4 h-4 text-gray-500" />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </VStack>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Box
                          bg="rgba(255,77,109,0.08)"
                          border="1px solid rgba(255,77,109,0.25)"
                          borderRadius="12px"
                          px={4}
                          py={3}
                          display="flex"
                          alignItems="center"
                          gap={3}
                          mb={5}
                        >
                          <Box
                            w="6px"
                            h="6px"
                            borderRadius="full"
                            bg="#FF4D6D"
                            flexShrink={0}
                          />
                          <Text
                            fontFamily="'DM Sans', sans-serif"
                            fontSize="sm"
                            color="#FF4D6D"
                          >
                            {error}
                          </Text>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#C8F135] hover:bg-[#b5dc1f] text-black font-bold text-lg rounded-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create account</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Sign In Link */}
                <Box
                  mt={7}
                  pt={6}
                  borderTop="1px solid rgba(255,255,255,0.06)"
                  textAlign="center"
                >
                  <Text
                    fontFamily="'DM Sans', sans-serif"
                    fontSize="14px"
                    color="rgba(255,255,255,0.4)"
                  >
                    Already have an account?{' '}
                    <NextLink href="/login" style={{ textDecoration: 'none' }}>
                      <Box
                        as="span"
                        color="#C8F135"
                        fontWeight={600}
                        cursor="pointer"
                        _hover={{ opacity: 0.8 }}
                        transition="opacity 0.15s"
                      >
                        Sign in
                      </Box>
                    </NextLink>
                  </Text>
                </Box>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <HStack spacing={5} justify="center" mt={6} flexWrap="wrap">
                  {[
                    { icon: ShieldCheckIcon, label: 'SOC 2 compliant' },
                    { icon: LockClosedIcon, label: 'End-to-end encrypted' },
                  ].map((badge, idx) => (
                    <HStack key={idx} spacing={2}>
                      <Icon
                        as={badge.icon}
                        w="13px"
                        h="13px"
                        color="rgba(255,255,255,0.3)"
                      />
                      <Text
                        fontFamily="'Space Mono', monospace"
                        fontSize="10px"
                        color="rgba(255,255,255,0.3)"
                        letterSpacing=".04em"
                      >
                        {badge.label}
                      </Text>
                    </HStack>
                  ))}
                </HStack>
              </motion.div>
            </Box>
          </Flex>

          {/* Bottom Footer Links */}
          <Flex
            justify="center"
            gap={6}
            pb={8}
            px={6}
            flexWrap="wrap"
            position="relative"
            zIndex={5}
          >
            {['Privacy Policy', 'Terms', 'Security', 'Help'].map((link) => (
              <Text
                key={link}
                as="a"
                href="#"
                fontFamily="'Space Mono', monospace"
                fontSize="10px"
                color="rgba(255,255,255,0.25)"
                letterSpacing=".04em"
                textDecoration="none"
                _hover={{ color: 'rgba(255,255,255,0.5)' }}
                transition="color 0.2s"
              >
                {link}
              </Text>
            ))}
          </Flex>
        </Box>
      </Box>
    </ChakraProvider>
  );
}