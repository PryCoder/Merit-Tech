import {
  Box,
  Container,
  Text,
  Heading,
  SimpleGrid,
  HStack,
  VStack,
  Divider,
  Tag,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

// 🔥 UI Components
import { MagicCard } from '@/components/ui/magic-card';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { TextReveal } from '@/components/ui/text-reveal';
import { Spotlight } from '@/components/ui/spotlight';

function Pricings() {
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
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For large orgs with custom workflows and compliance.',
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
    },
  ];

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      style={{
        paddingTop: '10rem',
        paddingBottom: '10rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* 🔥 Spotlight Background */}
      <Spotlight
        className="top-[-200px] left-1/2 -translate-x-1/2"
        fill="rgba(200,241,53,0.15)"
      />

      <Container maxW="1280px" position="relative" zIndex={2}>
        {/* 🔥 Heading */}
        <Box textAlign="center" mb={24}>
          <Text
            fontFamily="'Space Mono', monospace"
            fontSize="13px"
            letterSpacing=".2em"
            color="brand.lime"
            textTransform="uppercase"
            mb={6}
          >
            // Pricing
          </Text>

          <Heading
            fontFamily="'Syne', sans-serif"
            fontWeight={800}
            fontSize={{ base: '3rem', md: '4.5rem' }}
            letterSpacing="-0.04em"
          >
            {/* ✅ FIX: TextReveal gets STRING only */}
            <TextReveal>{'Simple pricing.'}</TextReveal>

            {/* Styled part separate */}
            <Box
              as="span"
              ml={3}
              fontFamily="'Instrument Serif', serif"
              fontStyle="italic"
              fontWeight={400}
              color="brand.lime"
            >
              No surprises.
            </Box>
          </Heading>
        </Box>

        {/* 🔥 Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {plans.map((p, i) => (
            <MagicCard
              key={i}
              className={p.highlight ? 'ring-2 ring-lime-400/40' : ''}
            >
              <HoverBorderGradient>
                <Box
                  bg={p.highlight ? 'rgba(200,241,53,0.05)' : '#16161E'}
                  borderRadius="28px"
                  p={10}
                  h="full"
                  position="relative"
                  transform={
                    p.highlight ? { base: 'none', md: 'scale(1.05)' } : 'none'
                  }
                  transition="all 0.3s ease"
                >
                  {/* Popular Tag */}
                  {p.highlight && (
                    <Box
                      position="absolute"
                      top="-16px"
                      left="50%"
                      transform="translateX(-50%)"
                    >
                      <Tag
                        bg="brand.lime"
                        color="black"
                        fontWeight={800}
                        fontSize="12px"
                        borderRadius="full"
                        px={5}
                        py="6px"
                      >
                        MOST POPULAR
                      </Tag>
                    </Box>
                  )}

                  {/* Plan Name */}
                  <Text
                    fontFamily="'Syne', sans-serif"
                    fontWeight={700}
                    fontSize="15px"
                    color="rgba(255,255,255,0.5)"
                    textTransform="uppercase"
                    letterSpacing=".08em"
                    mb={4}
                  >
                    {p.name}
                  </Text>

                  {/* Price */}
                  <HStack align="baseline" mb={4}>
                    <Text
                      fontFamily="'Bebas Neue', sans-serif"
                      fontSize="64px"
                      lineHeight={1}
                      color={p.highlight ? 'brand.lime' : '#fff'}
                    >
                      {p.price}
                    </Text>
                    <Text color="rgba(255,255,255,0.4)" fontSize="18px">
                      {p.period}
                    </Text>
                  </HStack>

                  {/* Description */}
                  <Text
                    fontSize="15px"
                    color="rgba(255,255,255,0.5)"
                    lineHeight={1.8}
                    mb={8}
                  >
                    {p.desc}
                  </Text>

                  {/* CTA */}
                  <ShimmerButton
                    style={{ width: '100%', marginBottom: '2rem' }}
                  >
                    {p.cta}
                  </ShimmerButton>

                  <Divider borderColor="rgba(255,255,255,0.08)" mb={6} />

                  {/* Features */}
                  <VStack spacing={4} align="flex-start">
                    {p.features.map((f, j) => (
                      <HStack key={j} spacing={3}>
                        <Icon
                          as={CheckCircleIcon}
                          color={
                            p.highlight ? 'brand.lime' : 'rgba(255,255,255,0.3)'
                          }
                        />
                        <Text color="rgba(255,255,255,0.65)" fontSize="14px">
                          {f}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </HoverBorderGradient>
            </MagicCard>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default Pricings;
