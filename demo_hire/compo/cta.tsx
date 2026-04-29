import { Box, Container, Text, Heading, HStack } from '@chakra-ui/react';

import { TextReveal } from '@/components/ui/text-reveal';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { NoiseTexture } from '@/components/ui/noise-texture';

export default function CTA() {
  return (
    <Box as="section" position="relative" overflow="hidden">
      {/* Clean background container - reduced padding */}
      <Box
        position="relative"
        maxW="900px"
        mx="auto"
        borderRadius="20px"
        overflow="hidden"
        bg="linear-gradient(180deg, rgba(20,20,20,0.6), rgba(10,10,10,0.9))"
        border="1px solid rgba(255,255,255,0.08)"
      >
        {/* Noise texture */}
        <Box position="absolute" inset={0} pointerEvents="none">
          <NoiseTexture opacity={0.05} />
        </Box>

        {/* Content - REDUCED PADDING */}
        <Box
          py={{ base: 8, md: 12 }} // Changed from 14,20 to 8,12
          px={{ base: 5, md: 10 }}
          textAlign="center"
          position="relative"
        >
          <Container maxW="500px" position="relative" zIndex={2}>
            {' '}
            {/* Reduced from 600px to 500px */}
            {/* Tagline */}
            <Text
              fontFamily="'Space Mono', monospace"
              fontSize="10px"
              letterSpacing=".14em"
              color="brand.lime"
              textTransform="uppercase"
              mb={2} // Reduced from 3 to 2
            >
              // Ready to Prove Yourself?
            </Text>
            {/* Headline - REDUCED FONT SIZES */}
            <Heading
              fontFamily="'Bebas Neue', sans-serif"
              fontWeight={400}
              fontSize={{
                base: '1.8rem', // Reduced from 2.2rem
                sm: '2.2rem', // Reduced from 2.8rem
                md: '2.8rem', // Reduced from 3.8rem
                lg: '3.5rem', // Reduced from 4.8rem
              }}
              lineHeight={1.05}
              letterSpacing="-0.02em"
              mb={3} // Reduced from 4
            >
              <Box>
                <TextReveal>{'YOUR CODE.'}</TextReveal>
              </Box>

              <Box>
                <AnimatedGradientText>YOUR CAREER.</AnimatedGradientText>
              </Box>
            </Heading>
            {/* Subtext - REDUCED MARGIN */}
            <Text
              fontFamily="'Instrument Serif', serif"
              fontStyle="italic"
              fontSize={{ base: '0.85rem', md: '0.95rem' }} // Reduced sizes
              color="rgba(255,255,255,0.5)"
              mb={4} // Reduced from 6 to 4
              lineHeight={1.5}
            >
              LeetCode + AI mentor + hiring platform — no résumés.
            </Text>
            {/* CTA - REDUCED BUTTON SIZES */}
            <HStack spacing={3} justify="center" flexWrap="wrap">
              <ShimmerButton
                style={{
                  padding: '8px 18px', // Reduced from 12px 22px
                  fontSize: '13px', // Reduced from 14px
                  borderRadius: '8px',
                }}
              >
                Start Solving
              </ShimmerButton>

              <Box
                as="button"
                px={4} // Reduced from 5
                py={2} // Reduced from 3
                fontSize="13px" // Reduced from 14px
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
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
