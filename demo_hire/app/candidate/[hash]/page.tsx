'use client';

import NextLink from 'next/link';
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Link,
  Select,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { ApiError, fetchJson } from '../../lib/fetchJson';

type CandidateProfile = {
  candidate: {
    publicId: string;
    revealed: boolean;
    name?: string | null;
    email?: string | null;
  };
  sessions: Array<{
    id: string;
    assessment: { id: string; title: string; revealThreshold: number } | null;
    status: string;
    createdAt: string;
    submittedAt: string | null;
    submission: {
      passed?: boolean;
      timeMs?: number;
      hintsUsed?: number;
      testsPassed?: number;
      testsTotal?: number;
      language?: string;
      notes?: string;
    } | null;
    score: { score: number; breakdown?: any } | null;
  }>;
};

type ReplayResponse = {
  replay: {
    sessionId: string;
    events: Array<{ type: string; payload: any; ts: number }>;
    createdAt: string;
    updatedAt: string;
  };
};

export default function CandidateEvaluationPage() {
  const params = useParams<{ hash: string }>();
  const searchParams = useSearchParams();

  const publicId = params?.hash ?? '';
  const initialSessionId = searchParams?.get('sessionId') ?? null;

  const [profile, setProfile] = React.useState<CandidateProfile | null>(null);
  const [selectedSessionId, setSelectedSessionId] = React.useState<
    string | null
  >(initialSessionId);
  const [replay, setReplay] = React.useState<ReplayResponse['replay'] | null>(
    null
  );

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isRevealing, setIsRevealing] = React.useState(false);

  async function loadProfile() {
    if (!publicId) {
      setError('Missing candidate id');
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchJson<CandidateProfile>(
        `/api/candidates/${encodeURIComponent(publicId)}`
      );
      setProfile(data);

      const preferred =
        selectedSessionId || initialSessionId || data.sessions?.[0]?.id || null;
      setSelectedSessionId(preferred);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load candidate'
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadReplay(sessionId: string) {
    setReplay(null);
    try {
      const data = await fetchJson<ReplayResponse>(
        `/api/sessions/${encodeURIComponent(sessionId)}/replay`
      );
      setReplay(data.replay);
    } catch {
      // replay is optional
      setReplay(null);
    }
  }

  React.useEffect(() => {
    if (!publicId) {
      setError('Missing candidate id');
      setProfile(null);
      setIsLoading(false);
      return;
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicId]);

  React.useEffect(() => {
    if (!selectedSessionId) {
      setReplay(null);
      return;
    }
    loadReplay(selectedSessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSessionId]);

  const selectedSession =
    profile?.sessions.find((s) => s.id === selectedSessionId) || null;
  const passingThreshold = selectedSession?.assessment?.revealThreshold ?? null;
  const meritScore = selectedSession?.score?.score ?? null;
  const canReveal =
    !profile?.candidate.revealed &&
    typeof passingThreshold === 'number' &&
    typeof meritScore === 'number' &&
    meritScore >= passingThreshold;

  const hintEvents = (replay?.events || []).filter((e) => e.type === 'HINT');

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
      <Container maxW="6xl" py={{ base: 10, md: 14 }}>
        <HStack
          justify="space-between"
          align="start"
          spacing={6}
          flexWrap="wrap"
        >
          <Box>
            <Link
              as={NextLink}
              href="/dashboard"
              color="brand.600"
              fontWeight={600}
            >
              ← Back to dashboard
            </Link>
            <Heading
              mt={3}
              fontFamily="var(--font-playfair)"
              fontSize={{ base: '3xl', md: '4xl' }}
            >
              Candidate Evaluation
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="90ch">
              Proof-of-work view: Ghost Replay, mentor transcript, test results,
              and the identity reveal gate.
            </Text>
            <HStack mt={4} spacing={3} flexWrap="wrap">
              <Badge
                variant="subtle"
                colorScheme="gray"
                fontFamily="var(--font-geist-mono)"
              >
                Hash: {publicId}
              </Badge>
              <Badge
                variant="subtle"
                colorScheme={profile?.candidate.revealed ? 'green' : 'orange'}
              >
                {profile?.candidate.revealed ? 'Unlocked' : 'Locked'}
              </Badge>
            </HStack>
          </Box>

          <Button variant="outline" onClick={loadProfile} isLoading={isLoading}>
            Refresh
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

        {isLoading ? <Text color="blackAlpha.600">Loading…</Text> : null}

        {!isLoading && profile ? (
          <Stack spacing={8}>
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
                    Identity
                  </Heading>
                  <Text color="blackAlpha.700" mt={1}>
                    Reveal stays locked until the passing Merit Score threshold
                    is met.
                  </Text>
                </Box>

                {!profile.candidate.revealed ? (
                  <Button
                    colorScheme="green"
                    bg="brand.600"
                    _hover={{ bg: 'brand.700' }}
                    isDisabled={!canReveal}
                    isLoading={isRevealing}
                    loadingText="Revealing"
                    onClick={async () => {
                      setIsRevealing(true);
                      try {
                        await fetchJson(
                          `/api/candidates/${encodeURIComponent(publicId)}/reveal`,
                          { method: 'POST' }
                        );
                        await loadProfile();
                      } catch (err) {
                        setError(
                          err instanceof ApiError
                            ? err.message
                            : 'Failed to reveal identity'
                        );
                      } finally {
                        setIsRevealing(false);
                      }
                    }}
                  >
                    Reveal identity
                  </Button>
                ) : null}
              </HStack>

              <Divider my={6} />

              {profile.candidate.revealed ? (
                <HStack spacing={8} flexWrap="wrap">
                  <Box>
                    <Text color="blackAlpha.600" fontSize="sm">
                      Name
                    </Text>
                    <Text fontWeight={700}>
                      {profile.candidate.name || '—'}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="blackAlpha.600" fontSize="sm">
                      Email
                    </Text>
                    <Text fontWeight={700}>
                      {profile.candidate.email || '—'}
                    </Text>
                  </Box>
                </HStack>
              ) : (
                <Text color="blackAlpha.600">
                  Locked — unlock after reaching the passing threshold.
                </Text>
              )}
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
                    Session
                  </Heading>
                  <Text color="blackAlpha.700" mt={1}>
                    Pick a submission to review.
                  </Text>
                </Box>

                <Box minW={{ base: '100%', md: '380px' }}>
                  <Select
                    value={selectedSessionId ?? ''}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    placeholder={
                      profile.sessions.length
                        ? 'Select a session'
                        : 'No sessions'
                    }
                  >
                    {profile.sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.assessment?.title || 'Assessment'} — {s.id}
                      </option>
                    ))}
                  </Select>
                </Box>
              </HStack>

              <Divider my={6} />

              {!selectedSession ? (
                <Text color="blackAlpha.600">
                  No submitted session selected.
                </Text>
              ) : (
                <HStack spacing={8} flexWrap="wrap">
                  <Box>
                    <Text color="blackAlpha.600" fontSize="sm">
                      Merit Score
                    </Text>
                    <Text fontWeight={700}>
                      {selectedSession.score?.score ?? '—'}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="blackAlpha.600" fontSize="sm">
                      Passing threshold
                    </Text>
                    <Text fontWeight={700}>
                      {selectedSession.assessment?.revealThreshold ?? '—'}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="blackAlpha.600" fontSize="sm">
                      Submitted
                    </Text>
                    <Text
                      fontWeight={700}
                      fontFamily="var(--font-geist-mono)"
                      fontSize="sm"
                    >
                      {selectedSession.submittedAt
                        ? new Date(selectedSession.submittedAt).toLocaleString()
                        : '—'}
                    </Text>
                  </Box>
                </HStack>
              )}
            </Box>

            <Box
              bg="white"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="blackAlpha.100"
              p={{ base: 6, md: 8 }}
            >
              <VStack align="stretch" spacing={5}>
                <Box>
                  <Heading as="h2" fontSize="2xl">
                    Ghost Replay
                  </Heading>
                  <Text color="blackAlpha.700" mt={1}>
                    Timeline of keystrokes, runs, tests, and mentor hints.
                  </Text>
                </Box>

                {!selectedSessionId ? (
                  <Text color="blackAlpha.600">
                    Select a session to view replay.
                  </Text>
                ) : !replay ? (
                  <Text color="blackAlpha.600">
                    No replay events captured yet.
                  </Text>
                ) : (
                  <Textarea
                    fontFamily="var(--font-geist-mono)"
                    readOnly
                    minH="220px"
                    value={replay.events
                      .map(
                        (e) =>
                          `${new Date(e.ts).toISOString()}  ${e.type}  ${JSON.stringify(e.payload)}`
                      )
                      .join('\n')}
                  />
                )}
              </VStack>
            </Box>

            <Box
              bg="white"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="blackAlpha.100"
              p={{ base: 6, md: 8 }}
            >
              <VStack align="stretch" spacing={5}>
                <Box>
                  <Heading as="h2" fontSize="2xl">
                    AI Mentor transcript
                  </Heading>
                  <Text color="blackAlpha.700" mt={1}>
                    Shows the candidate’s mentor prompts and non-spoiler hints.
                  </Text>
                </Box>

                {hintEvents.length === 0 ? (
                  <Text color="blackAlpha.600">
                    No mentor transcript captured yet.
                  </Text>
                ) : (
                  <Stack spacing={3}>
                    {hintEvents.map((e, idx) => (
                      <Box
                        key={`${e.ts}:${idx}`}
                        borderWidth="1px"
                        borderColor="blackAlpha.100"
                        borderRadius="xl"
                        p={4}
                      >
                        <Text
                          color="blackAlpha.600"
                          fontSize="xs"
                          fontFamily="var(--font-geist-mono)"
                        >
                          {new Date(e.ts).toLocaleString()}
                        </Text>
                        <Text mt={2} fontWeight={700}>
                          Prompt
                        </Text>
                        <Text color="blackAlpha.700" fontSize="sm">
                          {e.payload?.prompt || '—'}
                        </Text>
                        <Text mt={3} fontWeight={700}>
                          Hint
                        </Text>
                        <Text color="blackAlpha.700" fontSize="sm">
                          {e.payload?.hint || '—'}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                )}
              </VStack>
            </Box>

            <Box
              bg="white"
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="blackAlpha.100"
              p={{ base: 6, md: 8 }}
            >
              <VStack align="stretch" spacing={5}>
                <Box>
                  <Heading as="h2" fontSize="2xl">
                    Test case results
                  </Heading>
                  <Text color="blackAlpha.700" mt={1}>
                    Output from the candidate’s final run.
                  </Text>
                </Box>

                {!selectedSession?.submission ? (
                  <Text color="blackAlpha.600">
                    No submission payload recorded.
                  </Text>
                ) : (
                  <HStack spacing={8} flexWrap="wrap">
                    <Box>
                      <Text color="blackAlpha.600" fontSize="sm">
                        Passed
                      </Text>
                      <Text fontWeight={700}>
                        {String(!!selectedSession.submission.passed)}
                      </Text>
                    </Box>
                    <Box>
                      <Text color="blackAlpha.600" fontSize="sm">
                        Tests
                      </Text>
                      <Text fontWeight={700}>
                        {selectedSession.submission.testsPassed ?? '—'}/
                        {selectedSession.submission.testsTotal ?? '—'}
                      </Text>
                    </Box>
                    <Box>
                      <Text color="blackAlpha.600" fontSize="sm">
                        Hints used
                      </Text>
                      <Text fontWeight={700}>
                        {selectedSession.submission.hintsUsed ?? '—'}
                      </Text>
                    </Box>
                    <Box>
                      <Text color="blackAlpha.600" fontSize="sm">
                        Time
                      </Text>
                      <Text fontWeight={700}>
                        {typeof selectedSession.submission.timeMs === 'number'
                          ? `${Math.round(selectedSession.submission.timeMs / 1000)}s`
                          : '—'}
                      </Text>
                    </Box>
                  </HStack>
                )}
              </VStack>
            </Box>
          </Stack>
        ) : null}
      </Container>
    </Box>
  );
}
