'use client';

import React from 'react';
import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ApiError, fetchJson } from '../../../lib/fetchJson';

type AssessmentTask = {
  id?: string;
  title: string;
  prompt: string;
  exampleInput?: string;
  exampleOutput?: string;
};

type GetAssessmentResponse = {
  assessment: {
    id: string;
    title: string;
    description?: string;
    tasks: AssessmentTask[];
    revealThreshold: number;
  };
};

type StartSelfSessionResponse = {
  session: {
    id: string;
    assessmentId: string;
    candidatePublicId: string;
    startedAt: string;
  };
};

export default function AssessmentSetupPage() {
  const params = useParams<{ assessmentId: string }>();
  const assessmentId = params?.assessmentId ?? '';
  const router = useRouter();

  const [assessment, setAssessment] = React.useState<
    GetAssessmentResponse['assessment'] | null
  >(null);
  const [isStarting, setIsStarting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [ackRules, setAckRules] = React.useState(false);
  const [ackHonesty, setAckHonesty] = React.useState(false);
  const [ackSystem, setAckSystem] = React.useState(false);

  React.useEffect(() => {
    if (!assessmentId) {
      setError('Missing assessment id');
      return;
    }

    let cancelled = false;

    async function loadAssessment() {
      try {
        const res = await fetchJson<GetAssessmentResponse>(
          `/api/assessments/${encodeURIComponent(assessmentId)}`
        );
        if (!cancelled) setAssessment(res.assessment);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : 'Failed to load assessment'
          );
        }
      }
    }

    loadAssessment();
    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  async function start() {
    if (!assessmentId) {
      setError('Missing assessment id');
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      const res = await fetchJson<StartSelfSessionResponse>(
        `/api/assessments/${encodeURIComponent(assessmentId)}/sessions/self`,
        { method: 'POST' }
      );

      router.push(
        `/assessment/${assessmentId}/solve?sessionId=${encodeURIComponent(res.session.id)}`
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to start session'
      );
    } finally {
      setIsStarting(false);
    }
  }

  const canStart = Boolean(assessmentId) && ackRules && ackHonesty && ackSystem;

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
      <Container maxW="5xl" py={{ base: 10, md: 14 }}>
        <HStack
          justify="space-between"
          align="start"
          spacing={6}
          flexWrap="wrap"
        >
          <Box>
            <Badge
              bg="brand.100"
              color="brand.700"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
            >
              Candidate Portal
            </Badge>
            <Heading
              mt={3}
              fontFamily="var(--font-playfair)"
              fontSize={{ base: '3xl', md: '4xl' }}
            >
              Assessment Setup
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="70ch">
              Pre-flight checklist. Timer starts only after you click “Start
              Timer”.
            </Text>
          </Box>
          <Button as={NextLink} href="/dashboard" variant="outline" pt={2}>
            Back to dashboard
          </Button>
        </HStack>

        <Divider my={8} borderColor="blackAlpha.200" />

        {error ? (
          <Box
            borderWidth="1px"
            borderColor="red.200"
            bg="red.50"
            borderRadius="lg"
            px={4}
            py={3}
            mb={8}
          >
            <Text color="red.700" fontSize="sm">
              {error}
            </Text>
          </Box>
        ) : null}

        <Stack spacing={8}>
          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <Heading as="h2" fontSize="2xl">
              Assessment
            </Heading>
            <Text color="blackAlpha.700" mt={1}>
              {assessment?.title || 'Loading…'}
            </Text>
            {assessment?.description ? (
              <Text color="blackAlpha.700" mt={3} whiteSpace="pre-wrap">
                {assessment.description}
              </Text>
            ) : null}

            {assessment?.tasks?.length ? (
              <>
                <Divider my={6} />
                {assessment.tasks.map((t, idx) => (
                  <Box
                    key={t.id || `${idx}:${t.title}`}
                    borderWidth="1px"
                    borderColor="blackAlpha.100"
                    borderRadius="xl"
                    p={4}
                    mb={idx === assessment.tasks.length - 1 ? 0 : 4}
                  >
                    <Heading as="h3" fontSize="lg">
                      {t.title}
                    </Heading>
                    <Text mt={2} color="blackAlpha.700" whiteSpace="pre-wrap">
                      {t.prompt}
                    </Text>

                    {t.exampleInput || t.exampleOutput ? (
                      <Divider my={4} />
                    ) : null}

                    {t.exampleInput ? (
                      <Box>
                        <Text
                          fontWeight={700}
                          fontSize="sm"
                          color="blackAlpha.700"
                        >
                          Example input
                        </Text>
                        <Box
                          mt={2}
                          bg="blackAlpha.50"
                          borderWidth="1px"
                          borderColor="blackAlpha.100"
                          borderRadius="lg"
                          p={3}
                        >
                          <Text
                            fontFamily="var(--font-geist-mono)"
                            fontSize="sm"
                            whiteSpace="pre-wrap"
                          >
                            {t.exampleInput}
                          </Text>
                        </Box>
                      </Box>
                    ) : null}

                    {t.exampleOutput ? (
                      <Box mt={t.exampleInput ? 4 : 0}>
                        <Text
                          fontWeight={700}
                          fontSize="sm"
                          color="blackAlpha.700"
                        >
                          Example output
                        </Text>
                        <Box
                          mt={2}
                          bg="blackAlpha.50"
                          borderWidth="1px"
                          borderColor="blackAlpha.100"
                          borderRadius="lg"
                          p={3}
                        >
                          <Text
                            fontFamily="var(--font-geist-mono)"
                            fontSize="sm"
                            whiteSpace="pre-wrap"
                          >
                            {t.exampleOutput}
                          </Text>
                        </Box>
                      </Box>
                    ) : null}
                  </Box>
                ))}
              </>
            ) : null}
          </Box>

          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <Heading as="h2" fontSize="2xl">
              Rules
            </Heading>
            <Text color="blackAlpha.700" mt={1}>
              Keep this simple and fair.
            </Text>

            <Divider my={6} />

            <VStack align="stretch" spacing={4}>
              <Checkbox
                isChecked={ackRules}
                onChange={(e) => setAckRules(e.target.checked)}
              >
                I understand the assessment rules and time expectations.
              </Checkbox>
              <Checkbox
                isChecked={ackHonesty}
                onChange={(e) => setAckHonesty(e.target.checked)}
              >
                I will submit my own work.
              </Checkbox>
              <Checkbox
                isChecked={ackSystem}
                onChange={(e) => setAckSystem(e.target.checked)}
              >
                My device and connection are ready.
              </Checkbox>
            </VStack>
          </Box>

          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <Heading as="h2" fontSize="2xl">
              System check (MVP)
            </Heading>
            <Text color="blackAlpha.700" mt={1}>
              Browser supports code editor and event logging.
            </Text>

            <Divider my={6} />

            <HStack spacing={3} flexWrap="wrap">
              <Badge
                bg="blackAlpha.50"
                borderWidth="1px"
                borderColor="blackAlpha.100"
                px={3}
                py={1}
                borderRadius="full"
              >
                User agent:{' '}
                {typeof navigator !== 'undefined'
                  ? navigator.userAgent.slice(0, 40) + '…'
                  : '—'}
              </Badge>
              <Badge
                bg="blackAlpha.50"
                borderWidth="1px"
                borderColor="blackAlpha.100"
                px={3}
                py={1}
                borderRadius="full"
              >
                Online:{' '}
                {typeof navigator !== 'undefined'
                  ? navigator.onLine
                    ? 'Yes'
                    : 'No'
                  : '—'}
              </Badge>
            </HStack>
          </Box>

          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <HStack
              justify="space-between"
              align="start"
              spacing={6}
              flexWrap="wrap"
            >
              <Box>
                <Heading as="h2" fontSize="2xl">
                  Start
                </Heading>
                <Text color="blackAlpha.700" mt={1}>
                  This creates your session and begins the timer.
                </Text>
              </Box>
              <Button
                onClick={start}
                isDisabled={!canStart}
                isLoading={isStarting}
                colorScheme="green"
                bg="brand.600"
                _hover={{ bg: 'brand.700' }}
              >
                Start Timer
              </Button>
            </HStack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
