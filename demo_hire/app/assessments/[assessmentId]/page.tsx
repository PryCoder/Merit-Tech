'use client'

import NextLink from 'next/link'
import { useParams, useRouter } from 'next/navigation'
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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { ApiError, fetchJson } from '../../lib/fetchJson'

type Assessment = {
  id: string
  title: string
  description?: string
  revealThreshold: number
}

type RankingRow = {
  sessionId: string
  submittedAt: string
  score: { score: number; breakdown?: any }
  submission?: { hintsUsed?: number; timeMs?: number; testsPassed?: number; testsTotal?: number; passed?: boolean }
  candidate: { publicId: string; revealed: boolean }
}

type RankingResponse = {
  assessment: { id: string; title: string; revealThreshold: number }
  ranking: RankingRow[]
}

type GetAssessmentResponse = { assessment: Assessment }

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function computeAiDependencyIndex(row: RankingRow) {
  const hintsUsed =
    (typeof row.submission?.hintsUsed === 'number' ? row.submission?.hintsUsed : null) ??
    (typeof row.score?.breakdown?.hintPenalty === 'number'
      ? Math.round(row.score.breakdown.hintPenalty / 5)
      : 0)
  return clamp(Math.round(hintsUsed * 10), 0, 100)
}

function computeCodeEfficiency(row: RankingRow) {
  const timeMs = typeof row.submission?.timeMs === 'number' ? row.submission?.timeMs : null
  if (timeMs && timeMs > 0) {
    const minutes = timeMs / 60_000
    const timePenalty = clamp(Math.round(minutes * 2), 0, 30)
    return clamp(Math.round(100 - (timePenalty / 30) * 100), 0, 100)
  }

  const timePenalty = typeof row.score?.breakdown?.timePenalty === 'number' ? row.score.breakdown.timePenalty : 0
  return clamp(Math.round(100 - (timePenalty / 30) * 100), 0, 100)
}

export default function BlindLeaderboardPage() {
  const router = useRouter()
  const params = useParams<{ assessmentId: string }>()
  const assessmentId = params.assessmentId

  const [assessment, setAssessment] = React.useState<Assessment | null>(null)
  const [ranking, setRanking] = React.useState<RankingResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  async function loadAll() {
    setIsLoading(true)
    setError(null)
    try {
      const a = await fetchJson<GetAssessmentResponse>(`/api/assessments/${assessmentId}`)
      setAssessment(a.assessment)

      const r = await fetchJson<RankingResponse>(`/api/assessments/${assessmentId}/rankings`)
      setRanking(r)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load assessment')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId])

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
      <Container maxW="6xl" py={{ base: 10, md: 14 }}>
        <HStack justify="space-between" align="start" spacing={6} flexWrap="wrap">
          <Box>
            <Link as={NextLink} href="/dashboard" color="brand.600" fontWeight={600}>
              ← Back to dashboard
            </Link>
            <Heading mt={3} fontFamily="var(--font-playfair)" fontSize={{ base: '3xl', md: '4xl' }}>
              {assessment?.title || 'Blind Leaderboard'}
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="80ch">
              A data table listing candidates by hashed IDs only. Unlock Profile remains disabled until the passing threshold is met.
            </Text>
            <HStack mt={4} spacing={3} flexWrap="wrap">
              <Badge bg="brand.100" color="brand.700">
                Passing threshold: {assessment?.revealThreshold ?? '—'}
              </Badge>
              <Badge variant="subtle" colorScheme="gray" fontFamily="var(--font-geist-mono)">
                ID: {assessmentId}
              </Badge>
            </HStack>
          </Box>

          <Button variant="outline" onClick={loadAll} isLoading={isLoading}>
            Refresh
          </Button>
        </HStack>

        <Divider my={8} borderColor="blackAlpha.200" />

        {error ? (
          <Box borderWidth="1px" borderColor="red.200" bg="red.50" borderRadius="lg" px={4} py={3} mb={8}>
            <Text color="red.700" fontSize="sm">
              {error}
            </Text>
          </Box>
        ) : null}

        <Box bg="white" borderRadius="2xl" borderWidth="1px" borderColor="blackAlpha.100" p={{ base: 6, md: 8 }}>
          <VStack align="stretch" spacing={5}>
            <HStack justify="space-between" align="start" flexWrap="wrap" spacing={4}>
              <Box>
                <Heading as="h2" fontSize="2xl">
                  Leaderboard
                </Heading>
                <Text color="blackAlpha.700" mt={1}>
                  Merit Score, AI Dependency Index, and code efficiency are shown per session.
                </Text>
              </Box>
              <Button as={NextLink} href="/pipeline" variant="outline">
                Open pipeline
              </Button>
            </HStack>

            {!ranking || ranking.ranking.length === 0 ? (
              <Text color="blackAlpha.600">No submitted sessions yet.</Text>
            ) : (
              <Box overflowX="auto">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Candidate (hash)</Th>
                      <Th isNumeric>Merit Score</Th>
                      <Th isNumeric>AI Dependency Index</Th>
                      <Th isNumeric>Code efficiency</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {ranking.ranking.map((row) => {
                      const threshold = ranking.assessment.revealThreshold
                      const canUnlock = row.score.score >= threshold

                      return (
                        <Tr key={row.sessionId}>
                          <Td fontFamily="var(--font-geist-mono)">{row.candidate.publicId}</Td>
                          <Td isNumeric fontWeight={700}>
                            {row.score.score}
                          </Td>
                          <Td isNumeric>{computeAiDependencyIndex(row)}%</Td>
                          <Td isNumeric>{computeCodeEfficiency(row)}%</Td>
                          <Td>
                            <Button
                              size="sm"
                              colorScheme="green"
                              bg="brand.600"
                              _hover={{ bg: 'brand.700' }}
                              isDisabled={!canUnlock}
                              onClick={() => {
                                router.push(
                                  `/candidate/${row.candidate.publicId}?sessionId=${encodeURIComponent(row.sessionId)}`
                                )
                              }}
                            >
                              Unlock profile
                            </Button>
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </Box>
            )}
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
