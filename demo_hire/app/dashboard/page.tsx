'use client'

import NextLink from 'next/link'
import React from 'react'
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { ApiError, fetchJson } from '../lib/fetchJson'

type MeResponse = {
  user: { id: string; email: string; name?: string | null; role?: string; resumeUrl?: string | null; githubUrl?: string | null; portfolioUrl?: string | null }
}

type Assessment = {
  id: string
  title: string
  description?: string
  revealThreshold: number
  createdAt?: string
}

type ListAssessmentsResponse = { assessments: Assessment[] }

type RankingRow = {
  sessionId: string
  submittedAt: string
  score: { score: number }
  candidate: { publicId: string; revealed: boolean }
}

type RankingResponse = {
  assessment: { id: string; title: string; revealThreshold: number }
  ranking: RankingRow[]
}

type CompletionFeedItem = {
  assessmentId: string
  assessmentTitle: string
  submittedAt: string
  sessionId: string
  candidatePublicId: string
  meritScore: number
}

type CandidateDashboardResponse = {
  user: { id: string; email: string; name?: string | null; role?: string }
  candidate: { publicId: string; revealed: boolean }
  pendingInvites: Array<{ id: string; title: string; description?: string; revealThreshold: number }>
  completed: Array<{
    sessionId: string
    assessment: { id: string; title: string; revealThreshold: number } | null
    submittedAt: string
    score: { score: number; breakdown?: any } | null
    submission: any
  }>
  progression: Array<{ ts: string; score: number; assessmentId: string; assessmentTitle: string }>
}

function RecruiterDashboard() {
  const [assessments, setAssessments] = React.useState<Assessment[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [feed, setFeed] = React.useState<CompletionFeedItem[]>([])
  const [isFeedLoading, setIsFeedLoading] = React.useState(false)

  const [notes, setNotes] = React.useState(
    'Recruiter view: assessments map to job postings, rankings map to completions.'
  )

  async function refreshAssessments() {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchJson<ListAssessmentsResponse>('/api/assessments')
      setAssessments(data.assessments)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load assessments')
    } finally {
      setIsLoading(false)
    }
  }

  async function refreshFeed(currentAssessments: Assessment[]) {
    setIsFeedLoading(true)
    try {
      const rows = await Promise.all(
        currentAssessments.map(async (a) => {
          const r = await fetchJson<RankingResponse>(`/api/assessments/${a.id}/rankings`)
          return r.ranking.map((row) => ({
            assessmentId: a.id,
            assessmentTitle: r.assessment.title,
            submittedAt: row.submittedAt,
            sessionId: row.sessionId,
            candidatePublicId: row.candidate.publicId,
            meritScore: row.score.score,
          }))
        })
      )

      const merged = rows.flat().filter((r) => !!r.submittedAt)
      merged.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      setFeed(merged.slice(0, 10))
    } catch {
      // feed is non-critical
    } finally {
      setIsFeedLoading(false)
    }
  }

  React.useEffect(() => {
    refreshAssessments()
  }, [])

  React.useEffect(() => {
    if (assessments.length === 0) {
      setFeed([])
      return
    }

    refreshFeed(assessments)
    const id = window.setInterval(() => refreshFeed(assessments), 10_000)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessments.map((a) => a.id).join('|')])

  const totalAssessments = assessments.length
  const totalCompletions = feed.length
  const screeningTimeSavedHours = Math.round(totalCompletions * 0.75 * 10) / 10 // ~45 min per completion

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
      <Container maxW="6xl" py={{ base: 10, md: 14 }}>
        <HStack justify="space-between" align="start" spacing={6} flexWrap="wrap">
          <Box>
            <Badge bg="brand.100" color="brand.700" px={3} py={1} borderRadius="full" fontSize="xs">
              Recruiter Portal
            </Badge>
            <Heading mt={3} fontFamily="var(--font-playfair)" fontSize={{ base: '3xl', md: '4xl' }}>
              Overview Dashboard
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="70ch">
              High-level metrics, active job postings, and a real-time feed of candidate completions.
            </Text>
          </Box>

          <HStack spacing={3} pt={2}>
            <Button as={NextLink} href="/assessments/create" colorScheme="green" bg="brand.600" _hover={{ bg: 'brand.700' }}>
              Build assessment
            </Button>
            <Button as={NextLink} href="/pipeline" variant="outline">
              Pipeline
            </Button>
          </HStack>
        </HStack>

        <Divider my={8} borderColor="blackAlpha.200" />

        {error ? (
          <Box borderWidth="1px" borderColor="red.200" bg="red.50" borderRadius="lg" px={4} py={3} mb={8}>
            <Text color="red.700" fontSize="sm">
              {error}
            </Text>
          </Box>
        ) : null}

        <Stack spacing={8}>
          <Box bg="white" borderRadius="2xl" borderWidth="1px" borderColor="blackAlpha.100" p={{ base: 6, md: 8 }}>
            <HStack justify="space-between" align="start" spacing={6} flexWrap="wrap">
              <Box>
                <Heading as="h2" fontSize="2xl">
                  Metrics
                </Heading>
                <Text color="blackAlpha.700" mt={1}>
                  Quick signal on hiring throughput and pipeline health.
                </Text>
              </Box>
              <Button variant="outline" onClick={refreshAssessments} isLoading={isLoading}>
                Refresh
              </Button>
            </HStack>

            <HStack mt={6} spacing={3} flexWrap="wrap">
              <Badge bg="blackAlpha.50" borderWidth="1px" borderColor="blackAlpha.100" px={3} py={1} borderRadius="full">
                Total assessments: {totalAssessments}
              </Badge>
              <Badge bg="blackAlpha.50" borderWidth="1px" borderColor="blackAlpha.100" px={3} py={1} borderRadius="full">
                Recent completions: {totalCompletions}
              </Badge>
              <Badge bg="blackAlpha.50" borderWidth="1px" borderColor="blackAlpha.100" px={3} py={1} borderRadius="full">
                Screening time saved: ~{screeningTimeSavedHours}h
              </Badge>
            </HStack>
          </Box>

          <Box bg="white" borderRadius="2xl" borderWidth="1px" borderColor="blackAlpha.100" p={{ base: 6, md: 8 }}>
            <HStack justify="space-between" align="start" spacing={6} flexWrap="wrap">
              <Box>
                <Heading as="h2" fontSize="2xl">
                  Active job postings
                </Heading>
                <Text color="blackAlpha.700" mt={1}>
                  Assessments currently accepting candidate sessions.
                </Text>
              </Box>
              <Button as={NextLink} href="/assessments/create" colorScheme="green" bg="brand.600" _hover={{ bg: 'brand.700' }}>
                New posting
              </Button>
            </HStack>

            <Divider my={6} />

            {isLoading ? <Text color="blackAlpha.600">Loading…</Text> : null}
            {!isLoading && assessments.length === 0 ? <Text color="blackAlpha.600">No active postings.</Text> : null}

            <Stack spacing={3}>
              {assessments.map((a) => (
                <Box key={a.id} borderWidth="1px" borderColor="blackAlpha.100" borderRadius="xl" p={4} _hover={{ borderColor: 'blackAlpha.200' }}>
                  <HStack justify="space-between" align="start">
                    <Box>
                      <Link as={NextLink} href={`/assessments/${a.id}`} fontWeight={700} fontSize="lg">
                        {a.title}
                      </Link>
                      <Text color="blackAlpha.700" mt={1} noOfLines={2}>
                        {a.description || '—'}
                      </Text>
                      <HStack mt={3} spacing={3} color="blackAlpha.600" fontSize="sm">
                        <Text>Passing score: {a.revealThreshold}</Text>
                        <Text fontFamily="var(--font-geist-mono)">ID: {a.id}</Text>
                      </HStack>
                    </Box>
                    <Badge colorScheme="green" variant="subtle">
                      Active
                    </Badge>
                  </HStack>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box bg="white" borderRadius="2xl" borderWidth="1px" borderColor="blackAlpha.100" p={{ base: 6, md: 8 }}>
            <HStack justify="space-between" align="start" spacing={6} flexWrap="wrap">
              <Box>
                <Heading as="h2" fontSize="2xl">
                  Recent candidate completions
                </Heading>
                <Text color="blackAlpha.700" mt={1}>
                  Updates automatically every 10 seconds.
                </Text>
              </Box>
              <Button variant="outline" onClick={() => refreshFeed(assessments)} isLoading={isFeedLoading}>
                Refresh feed
              </Button>
            </HStack>

            <Divider my={6} />

            {feed.length === 0 ? (
              <Text color="blackAlpha.600">No completions yet.</Text>
            ) : (
              <Stack spacing={3}>
                {feed.map((item) => (
                  <Box key={`${item.sessionId}:${item.submittedAt}`} borderWidth="1px" borderColor="blackAlpha.100" borderRadius="xl" p={4}>
                    <HStack justify="space-between" align="start" spacing={6}>
                      <Box>
                        <Text fontWeight={700}>{item.assessmentTitle}</Text>
                        <Text mt={1} color="blackAlpha.700" fontSize="sm">
                          Candidate: <Box as="span" fontFamily="var(--font-geist-mono)">{item.candidatePublicId}</Box>
                        </Text>
                        <Text mt={1} color="blackAlpha.600" fontSize="sm">
                          Merit Score: <Box as="span" fontWeight={700}>{item.meritScore}</Box>
                        </Text>
                        <Text mt={1} color="blackAlpha.600" fontSize="xs" fontFamily="var(--font-geist-mono)">
                          {new Date(item.submittedAt).toLocaleString()} — Session {item.sessionId}
                        </Text>
                      </Box>
                      <Button as={NextLink} href={`/assessments/${item.assessmentId}`} variant="outline">
                        View leaderboard
                      </Button>
                    </HStack>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          <Box bg="white" borderRadius="2xl" borderWidth="1px" borderColor="blackAlpha.100" p={{ base: 6, md: 8 }}>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Heading as="h2" fontSize="2xl">
                  Notes
                </Heading>
                <Text color="blackAlpha.700" mt={1}>
                  Internal recruiter notes (MVP).
                </Text>
              </Box>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} minH="120px" />
            </VStack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

function CandidateDashboard({ me }: { me: MeResponse['user'] }) {
  const [data, setData] = React.useState<CandidateDashboardResponse | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  async function refresh() {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetchJson<CandidateDashboardResponse>('/api/candidate/me/dashboard')
      setData(res)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    refresh()
  }, [])

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
      <Container maxW="6xl" py={{ base: 10, md: 14 }}>
        <HStack justify="space-between" align="start" spacing={6} flexWrap="wrap">
          <Box>
            <Badge bg="brand.100" color="brand.700" px={3} py={1} borderRadius="full" fontSize="xs">
              Candidate Portal
            </Badge>
            <Heading mt={3} fontFamily="var(--font-playfair)" fontSize={{ base: '3xl', md: '4xl' }}>
              Candidate Dashboard
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="70ch">
              Pending assessment invites, completed challenges, and your Merit Score progression.
            </Text>
          </Box>

          <HStack spacing={3} pt={2}>
            <Button as={NextLink} href="/profile" variant="outline">
              Profile
            </Button>
            <Button variant="outline" onClick={refresh} isLoading={isLoading}>
              Refresh
            </Button>
          </HStack>
        </HStack>

        <Divider my={8} borderColor="blackAlpha.200" />

        {error ? (
          <Box borderWidth="1px" borderColor="red.200" bg="red.50" borderRadius="lg" px={4} py={3} mb={8}>
            <Text color="red.700" fontSize="sm">
              {error}
            </Text>
          </Box>
        ) : null}

        {isLoading ? <Text color="blackAlpha.600">Loading…</Text> : null}

        {!isLoading && data ? (
          <Stack spacing={8}>
            <Box bg="white" borderRadius="2xl" borderWidth="1px" borderColor="blackAlpha.100" p={{ base: 6, md: 8 }}>
              <Heading as="h2" fontSize="2xl">
                Pending invites
              </Heading>
              <Text color="blackAlpha.700" mt={1}>
                Start with a pre-flight setup before the timer begins.
              </Text>

              <Divider my={6} />

              {data.pendingInvites.length === 0 ? (
                <Text color="blackAlpha.600">No pending invites.</Text>
              ) : (
                <Stack spacing={3}>
                  {data.pendingInvites.map((a) => (
                    <Box key={a.id} borderWidth="1px" borderColor="blackAlpha.100" borderRadius="xl" p={4}>
                      <HStack justify="space-between" align="start" spacing={6} flexWrap="wrap">
                        <Box>
                          <Text fontWeight={700} fontSize="lg">
                            {a.title}
                          </Text>
                          <Text color="blackAlpha.700" mt={1} noOfLines={2}>
                            {a.description || '—'}
                          </Text>
                          <Text mt={2} color="blackAlpha.600" fontSize="sm">
                            Passing threshold: <Box as="span" fontWeight={700}>{a.revealThreshold}</Box>
                          </Text>
                        </Box>
                        <Button as={NextLink} href={`/assessment/${a.id}/setup`} colorScheme="green" bg="brand.600" _hover={{ bg: 'brand.700' }}>
                          Pre-flight
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            <Box bg="white" borderRadius="2xl" borderWidth="1px" borderColor="blackAlpha.100" p={{ base: 6, md: 8 }}>
              <Heading as="h2" fontSize="2xl">
                Completed challenges
              </Heading>
              <Text color="blackAlpha.700" mt={1}>
                Your history of submitted assessments.
              </Text>

              <Divider my={6} />

              {data.completed.length === 0 ? (
                <Text color="blackAlpha.600">No completed challenges yet.</Text>
              ) : (
                <Stack spacing={3}>
                  {data.completed.map((c) => (
                    <Box key={c.sessionId} borderWidth="1px" borderColor="blackAlpha.100" borderRadius="xl" p={4}>
                      <HStack justify="space-between" align="start" spacing={6} flexWrap="wrap">
                        <Box>
                          <Text fontWeight={700}>{c.assessment?.title || 'Assessment'}</Text>
                          <Text mt={1} color="blackAlpha.600" fontSize="sm" fontFamily="var(--font-geist-mono)">
                            {new Date(c.submittedAt).toLocaleString()} — Session {c.sessionId}
                          </Text>
                          <Text mt={2} color="blackAlpha.700" fontSize="sm">
                            Merit Score: <Box as="span" fontWeight={700}>{c.score?.score ?? '—'}</Box>
                          </Text>
                        </Box>
                        {c.assessment ? (
                          <Button
                            as={NextLink}
                            href={`/assessment/${c.assessment.id}/results?sessionId=${encodeURIComponent(c.sessionId)}`}
                            variant="outline"
                          >
                            View results
                          </Button>
                        ) : null}
                      </HStack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            <Box bg="white" borderRadius="2xl" borderWidth="1px" borderColor="blackAlpha.100" p={{ base: 6, md: 8 }}>
              <Heading as="h2" fontSize="2xl">
                Global Merit Score progression
              </Heading>
              <Text color="blackAlpha.700" mt={1}>
                Trend over your completed submissions.
              </Text>

              <Divider my={6} />

              {data.progression.length === 0 ? (
                <Text color="blackAlpha.600">No data yet.</Text>
              ) : (
                <Stack spacing={3}>
                  {data.progression.slice(-8).map((p) => (
                    <Box key={`${p.assessmentId}:${p.ts}`}>
                      <HStack justify="space-between" fontSize="sm" color="blackAlpha.700">
                        <Text noOfLines={1}>{p.assessmentTitle}</Text>
                        <Text fontFamily="var(--font-geist-mono)">{p.score}</Text>
                      </HStack>
                      <Box mt={2} h="10px" borderRadius="full" bg="blackAlpha.100" overflow="hidden">
                        <Box h="10px" bg="brand.600" width={`${Math.max(0, Math.min(100, p.score))}%`} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        ) : null}
      </Container>
    </Box>
  )
}

export default function DashboardPage() {
  const [me, setMe] = React.useState<MeResponse['user'] | null>(null)
  const [loadingMe, setLoadingMe] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    async function loadMe() {
      setLoadingMe(true)
      try {
        const res = await fetchJson<MeResponse>('/api/auth/me')
        if (!cancelled) setMe(res.user)
      } catch {
        if (!cancelled) setMe(null)
      } finally {
        if (!cancelled) setLoadingMe(false)
      }
    }

    loadMe()
    return () => {
      cancelled = true
    }
  }, [])

  if (loadingMe) {
    return (
      <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
        <Container maxW="4xl" py={{ base: 10, md: 14 }}>
          <Text color="blackAlpha.700">Loading…</Text>
        </Container>
      </Box>
    )
  }

  if (!me) {
    return (
      <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
        <Container maxW="4xl" py={{ base: 10, md: 14 }}>
          <VStack align="stretch" spacing={6}>
            <Box>
              <Badge bg="brand.100" color="brand.700" px={3} py={1} borderRadius="full" fontSize="xs">
                Merit-Loop
              </Badge>
              <Heading mt={3} fontFamily="var(--font-playfair)">
                Sign in to continue
              </Heading>
              <Text mt={2} color="blackAlpha.700">
                Your dashboard is role-based (Candidate vs Recruiter).
              </Text>
            </Box>

            <HStack spacing={3}>
              <Button as={NextLink} href="/login" variant="outline">
                Login
              </Button>
              <Button as={NextLink} href="/register" colorScheme="green" bg="brand.600" _hover={{ bg: 'brand.700' }}>
                Register
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    )
  }

  if (me.role === 'candidate') {
    return <CandidateDashboard me={me} />
  }

  return <RecruiterDashboard />
}
