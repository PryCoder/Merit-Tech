'use client';

import React from 'react';
import NextLink from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
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
  const [language] = React.useState('javascript');

  const [mentor, setMentor] = React.useState('');
  const [mentorStream, setMentorStream] = React.useState('');
  const [mentorLastHint, setMentorLastHint] = React.useState<string | null>(null);

  const [wsStatus, setWsStatus] = React.useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const wsRef = React.useRef<WebSocket | null>(null);
  const versionRef = React.useRef<number>(0);
  const sendTimerRef = React.useRef<number | null>(null);
  const pendingCodeRef = React.useRef<string>('');
  const [hintsUsed, setHintsUsed] = React.useState(0);

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

  React.useEffect(() => {
    if (!sessionId) return;

    const base =
      process.env.NEXT_PUBLIC_WS_BASE_URL ||
      (process.env.NEXT_PUBLIC_API_BASE_URL
        ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/^http/, 'ws')
        : null) ||
      'ws://localhost:8081';

    const url = `${base.replace(/\/$/, '')}/ws?sessionId=${encodeURIComponent(sessionId)}`;

    let closed = false;
    let reconnectAttempt = 0;

    function connect() {
      if (closed) return;
      setWsStatus('connecting');
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttempt = 0;
        setWsStatus('connected');
        ws.send(JSON.stringify({ type: 'PING' }));
      };

      ws.onmessage = (evt) => {
        let msg: any = null;
        try {
          msg = JSON.parse(String(evt.data));
        } catch {
          msg = null;
        }
        if (!msg?.type) return;

        if (msg.type === 'WELCOME') {
          const snapshotCode = typeof msg?.snapshot?.code === 'string' ? msg.snapshot.code : '';
          const snapshotVersion = Number.isFinite(msg?.snapshot?.version) ? msg.snapshot.version : 0;
          setCode(snapshotCode || '// Write your solution here\n');
          versionRef.current = snapshotVersion;
          setHintsUsed(Number.isFinite(msg?.hintsUsed) ? msg.hintsUsed : 0);
          return;
        }

        if (msg.type === 'CODE_UPDATE') {
          if (typeof msg.code === 'string') setCode(msg.code);
          if (Number.isFinite(msg.version)) versionRef.current = msg.version;
          return;
        }

        if (msg.type === 'HINT_STREAM_START') {
          setMentorStream('');
          return;
        }

        if (msg.type === 'HINT_STREAM_CHUNK') {
          if (typeof msg.chunk === 'string') {
            setMentorStream((s) => s + msg.chunk);
          }
          return;
        }

        if (msg.type === 'HINT_STREAM_END') {
          const hint = typeof msg.hint === 'string' ? msg.hint : '';
          setMentorStream('');
          setMentorLastHint(hint || null);
          setHintsUsed((n) => n + 1);
          return;
        }

        if (msg.type === 'ERROR') {
          const m = typeof msg.message === 'string' ? msg.message : 'Realtime error';
          setError(m);
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        setWsStatus('disconnected');
        if (closed) return;
        reconnectAttempt += 1;
        const waitMs = Math.min(1500 * reconnectAttempt, 8000);
        window.setTimeout(connect, waitMs);
      };
    }

    connect();

    return () => {
      closed = true;
      setWsStatus('disconnected');
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [sessionId]);

  async function submit() {
    if (!sessionId) return;
    setError(null);

    const timeMs = Math.max(0, Date.now() - timerStartedAt);

    // Best-effort flush of the latest code snapshot.
    if (sendTimerRef.current) {
      window.clearTimeout(sendTimerRef.current);
      sendTimerRef.current = null;
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      versionRef.current += 1;
      wsRef.current.send(
        JSON.stringify({
          type: 'EDITOR_SYNC',
          code,
          language,
          version: versionRef.current,
          ts: Date.now(),
        })
      );
    }

    try {
      await fetchJson(`/api/sessions/${encodeURIComponent(sessionId)}/submit`, {
        method: 'POST',
        body: {
          passed: true,
          timeMs,
          hintsUsed,
          language,
        },
      });

      router.push(
        `/assessment/${assessmentId}/results?sessionId=${encodeURIComponent(sessionId)}`
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to submit');
    }
  }

  function queueSync(nextCode: string) {
    pendingCodeRef.current = nextCode;

    if (sendTimerRef.current) {
      window.clearTimeout(sendTimerRef.current);
      sendTimerRef.current = null;
    }

    sendTimerRef.current = window.setTimeout(() => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;

      versionRef.current += 1;

      ws.send(
        JSON.stringify({
          type: 'EDITOR_SYNC',
          code: pendingCodeRef.current,
          language,
          version: versionRef.current,
          ts: Date.now(),
        })
      );
    }, 120);
  }

  async function askHint() {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError('Realtime connection not ready');
      return;
    }
    setError(null);
    setMentorLastHint(null);
    setMentorStream('');
    ws.send(JSON.stringify({ type: 'REQUEST_HINT', prompt: mentor }));
    setMentor('');
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
              {' '}· Realtime:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {wsStatus}
              </Box>
              {' '}· Hints:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {hintsUsed}
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
                Code editor
              </Heading>
              <Text color="blackAlpha.700" mt={1}>
                Live-sync to server via WebSockets (session resumes after reconnect).
              </Text>

              <Divider my={6} />
              <Box borderWidth="1px" borderColor="blackAlpha.100" borderRadius="lg" overflow="hidden">
                <Editor
                  height="420px"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(v) => {
                    const next = v ?? '';
                    setCode(next);
                    queueSync(next);
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: 'var(--font-geist-mono)',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </Box>
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
                Mentor
              </Heading>
              <Text color="blackAlpha.700" mt={1}>
                Auto-hints appear if you’re idle; you can also ask.
              </Text>

              <Divider my={6} />

              <VStack align="stretch" spacing={3}>
                {mentorStream ? (
                  <Box
                    borderWidth="1px"
                    borderColor="blackAlpha.100"
                    borderRadius="lg"
                    p={3}
                    bg="blackAlpha.50"
                  >
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                      {mentorStream}
                    </Text>
                  </Box>
                ) : null}

                {mentorLastHint ? (
                  <Box
                    borderWidth="1px"
                    borderColor="blackAlpha.100"
                    borderRadius="lg"
                    p={3}
                    bg="blackAlpha.50"
                  >
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                      {mentorLastHint}
                    </Text>
                  </Box>
                ) : null}

                <Input
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                  placeholder="Ask a question…"
                />
                <Button
                  variant="outline"
                  onClick={askHint}
                  isDisabled={!sessionId || wsStatus !== 'connected' || !mentor.trim()}
                >
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
