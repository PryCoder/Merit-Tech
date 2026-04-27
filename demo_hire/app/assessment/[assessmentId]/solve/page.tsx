'use client';

import React from 'react';
import NextLink from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
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

export default function AssessmentSolvePage() {
  const params = useParams<{ assessmentId: string }>();
  const assessmentId = params?.assessmentId ?? '';
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams?.get('sessionId') ?? '';

  const [assessment, setAssessment] = React.useState<
    GetAssessmentResponse['assessment'] | null
  >(null);
  const [error, setError] = React.useState<string | null>(null);

  const [code, setCode] = React.useState('// Write your solution here\n');
  const [mentor, setMentor] = React.useState('');

  const [timerStartedAt] = React.useState(() => Date.now());

  const elapsedSec = Math.floor((Date.now() - timerStartedAt) / 1000);

  React.useEffect(() => {
    if (!assessmentId) {
      setError('Missing assessment id');
      return;
    }

    let cancelled = false;

    async function loadAssessment() {
      setError(null);
      try {
        const res = await fetchJson<GetAssessmentResponse>(
          `/api/assessments/${encodeURIComponent(assessmentId)}`
        );
        if (!cancelled) setAssessment(res.assessment);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof ApiError ? err.message : 'Failed to load assessment'
          );
      }
    }

    loadAssessment();
    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  function submit() {
    // MVP: backend submit endpoint isn’t exposed in the proxy set yet.
    // For now, take the user to results using the sessionId.
    router.push(
      `/assessment/${assessmentId}/results?sessionId=${encodeURIComponent(sessionId)}`
    );
  }

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
      <Container maxW="7xl" py={{ base: 10, md: 14 }}>
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
              Solve
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="80ch">
              Session:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {sessionId || '—'}
              </Box>{' '}
              · Time elapsed:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {elapsedSec}s
              </Box>
            </Text>
          </Box>

          <HStack spacing={3} pt={2}>
            <Button as={NextLink} href="/dashboard" variant="outline">
              Dashboard
            </Button>
            <Button
              onClick={submit}
              colorScheme="green"
              bg="brand.600"
              _hover={{ bg: 'brand.700' }}
              isDisabled={!sessionId}
            >
              Submit
            </Button>
          </HStack>
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

        {!sessionId ? (
          <Box
            borderWidth="1px"
            borderColor="orange.200"
            bg="orange.50"
            borderRadius="lg"
            px={4}
            py={3}
            mb={8}
          >
            <Text color="orange.800" fontSize="sm">
              Missing sessionId. Please start from the setup page.
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
              Problem
            </Heading>

            <Text color="blackAlpha.700" mt={2} fontWeight={700}>
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
            ) : (
              <Text mt={3} color="blackAlpha.600" fontSize="sm">
                No questions found for this assessment.
              </Text>
            )}
          </Box>

          <HStack
            align="start"
            spacing={6}
            flexWrap={{ base: 'wrap', lg: 'nowrap' }}
          >
            <Box
              flex={1}
              minW={{ base: '100%', lg: '55%' }}
              bg="white"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="blackAlpha.100"
              p={{ base: 6, md: 8 }}
            >
              <Heading as="h2" fontSize="2xl">
                Code editor (MVP)
              </Heading>
              <Text color="blackAlpha.700" mt={1}>
                Use this text area as the editor for now.
              </Text>

              <Divider my={6} />

              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                minH="360px"
                fontFamily="var(--font-geist-mono)"
                fontSize="sm"
              />
            </Box>

            <Box
              flex={1}
              minW={{ base: '100%', lg: '45%' }}
              bg="white"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="blackAlpha.100"
              p={{ base: 6, md: 8 }}
            >
              <Heading as="h2" fontSize="2xl">
                Mentor (MVP)
              </Heading>
              <Text color="blackAlpha.700" mt={1}>
                Ask for hints. (Wiring to mentor API can be added next.)
              </Text>

              <Divider my={6} />

              <VStack align="stretch" spacing={3}>
                <Input
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                  placeholder="Ask a question…"
                />
                <Button variant="outline" isDisabled>
                  Send
                </Button>
              </VStack>
            </Box>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}
