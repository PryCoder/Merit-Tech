'use client';

import React from 'react';
import NextLink from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';

import { ApiError, fetchJson } from '../../../lib/fetchJson';

type ResultsResponse = {
  assessment: { id: string; title: string; revealThreshold: number } | null;
  session: {
    id: string;
    status: string;
    createdAt: string;
    submittedAt: string | null;
    score: { score: number; breakdown: any; createdAt?: string } | null;
    submission: any;
  };
  candidate: { publicId: string; revealed: boolean; name?: string; email?: string } | null;
  replay: { sessionId: string; events: Array<{ type: string; payload: any; ts: number }> } | null;
  roadmap: {
    band: string;
    skillGaps: Array<{ area: string; severity: string; why: string }>;
    focusTags: string[];
    resources: Array<{ kind: string; title: string; url: string }>;
    plan: Array<{ day: number; title: string; items: string[] }>;
    metrics: any;
  };
};

export default function AssessmentResultsPage() {
  const params = useParams<{ assessmentId: string }>();
  const assessmentId = params?.assessmentId;
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('sessionId') ?? '';

  const [data, setData] = React.useState<ResultsResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    async function load() {
      setError(null);
      try {
        const res = await fetchJson<ResultsResponse>(
          `/api/sessions/${encodeURIComponent(sessionId)}/results`
        );
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof ApiError ? err.message : 'Failed to load results'
          );
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!assessmentId) {
    return (
      <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
        <Container maxW="5xl" py={{ base: 10, md: 14 }}>
          <Stack spacing={4}>
            <Heading
              fontFamily="var(--font-playfair)"
              fontSize={{ base: '3xl', md: '4xl' }}
            >
              Results
            </Heading>
            <Text color="blackAlpha.700">Missing assessment id.</Text>
            <Button
              as={NextLink}
              href="/dashboard"
              variant="outline"
              alignSelf="start"
            >
              Back to dashboard
            </Button>
          </Stack>
        </Container>
      </Box>
    );
  }

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
              Results
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="70ch">
              Merit Score, replay, and your 7-day learning path.
            </Text>
          </Box>

          <HStack spacing={3} pt={2}>
            <Button as={NextLink} href="/dashboard" variant="outline">
              Back to dashboard
            </Button>
            <Button
              as={NextLink}
              href={`/assessment/${assessmentId}/setup`}
              colorScheme="green"
              bg="brand.600"
              _hover={{ bg: 'brand.700' }}
            >
              Retry (new session)
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
            mb={6}
          >
            <Text color="red.700" fontSize="sm">
              {error}
            </Text>
          </Box>
        ) : null}

        <Stack spacing={6}>
          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <Heading as="h2" fontSize="2xl">
              Summary
            </Heading>
            <Divider my={6} />
            <Text color="blackAlpha.700">
              Assessment:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {data?.assessment?.id || assessmentId}
              </Box>
            </Text>
            <Text color="blackAlpha.700" mt={2}>
              Title:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {data?.assessment?.title || '—'}
              </Box>
            </Text>
            <Text color="blackAlpha.700" mt={2}>
              Session:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {sessionId || '—'}
              </Box>
            </Text>

            <Divider my={6} />

            <Text color="blackAlpha.700">
              Merit Score:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {data?.session?.score?.score ?? '—'}
              </Box>
            </Text>

            <Text color="blackAlpha.700" mt={2}>
              Hints used:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {data?.roadmap?.metrics?.hintsUsed ?? '—'}
              </Box>
            </Text>

            <Text color="blackAlpha.600" mt={4} fontSize="sm">
              Band: {data?.roadmap?.band || '—'} · Focus:{' '}
              {(data?.roadmap?.focusTags || []).join(', ') || '—'}
            </Text>
          </Box>

          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <Heading as="h2" fontSize="2xl">
              Skill Gap Analysis
            </Heading>
            <Divider my={6} />
            {(data?.roadmap?.skillGaps || []).length ? (
              <Stack spacing={3}>
                {data!.roadmap.skillGaps.map((g, idx) => (
                  <Box
                    key={`${idx}:${g.area}`}
                    borderWidth="1px"
                    borderColor="blackAlpha.100"
                    borderRadius="xl"
                    p={4}
                  >
                    <Text fontWeight={800}>{g.area}</Text>
                    <Text color="blackAlpha.600" fontSize="sm" mt={1}>
                      Severity: {g.severity}
                    </Text>
                    <Text color="blackAlpha.700" mt={2}>
                      {g.why}
                    </Text>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Text color="blackAlpha.600">No gaps found.</Text>
            )}
          </Box>

          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <Heading as="h2" fontSize="2xl">
              7‑Day Learning Path
            </Heading>
            <Divider my={6} />
            {(data?.roadmap?.plan || []).length ? (
              <Stack spacing={3}>
                {data!.roadmap.plan.map((d) => (
                  <Box
                    key={d.day}
                    borderWidth="1px"
                    borderColor="blackAlpha.100"
                    borderRadius="xl"
                    p={4}
                  >
                    <Text fontWeight={800}>
                      Day {d.day}: {d.title}
                    </Text>
                    <Text mt={2} color="blackAlpha.700" whiteSpace="pre-wrap">
                      {d.items.map((it) => `• ${it}`).join('\n')}
                    </Text>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Text color="blackAlpha.600">No plan generated.</Text>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
