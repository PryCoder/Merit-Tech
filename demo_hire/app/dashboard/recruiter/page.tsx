'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Card,
  CardBody,
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Textarea,
  Divider,
  useToast,
  Select,
} from '@chakra-ui/react';
import {
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  EyeIcon,
  LockClosedIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import { ApiError, fetchJson } from '../../lib/fetchJson';

interface Candidate {
  publicId: string;
  sessionId: string;
  rank: number;
  score: number;
  skills: string[];
  ghostAvailable: boolean;
  revealed: boolean;
  name?: string;
  email?: string;
}

type GeneratedAssessment = {
  assessment: {
    id: string;
    title: string;
    description?: string;
    tasks: Array<{ title: string; prompt: string }>;
    revealThreshold: number;
    techStack?: string[];
  };
  draftSource: 'groq' | 'grok' | 'deterministic';
};

type AssessmentsResponse = {
  assessments: Array<{
    id: string;
    title: string;
    description?: string;
    revealThreshold: number;
    techStack?: string[];
  }>;
};

type RankingsResponse = {
  assessment: {
    id: string;
    title: string;
    revealThreshold: number;
  };
  ranking: Array<{
    sessionId: string;
    score: { score: number };
    submission?: { language?: string; timeMs?: number; hintsUsed?: number };
    candidate: {
      publicId: string;
      revealed: boolean;
      name?: string;
      email?: string;
    };
    submittedAt?: string;
  }>;
};

function average(numbers: number[]) {
  if (!numbers.length) return 0;
  return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
}

export default function RecruiterDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [meritThreshold, setMeritThreshold] = useState(75);
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedAssessment | null>(null);
  const [assessments, setAssessments] = useState<AssessmentsResponse['assessments']>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('');
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentsResponse['assessments'][number] | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [rankingsMeta, setRankingsMeta] = useState<RankingsResponse['assessment'] | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const me = await fetchJson<{ user: { role?: string } }>('/api/auth/me');
        const role = String(me?.user?.role || '').toLowerCase();
        if (role) localStorage.setItem('userRole', role);
        if (role !== 'recruiter' && role !== 'company') {
          router.push('/login');
          return;
        }

        const a = await fetchJson<AssessmentsResponse>('/api/assessments');
        const list = Array.isArray(a.assessments) ? a.assessments : [];
        if (cancelled) return;
        setAssessments(list);

        if (list.length) {
          setSelectedAssessmentId(list[0].id);
          setSelectedAssessment(list[0]);
        }
      } catch {
        if (!cancelled) router.push('/login');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!selectedAssessmentId) {
        setCandidates([]);
        setRankingsMeta(null);
        return;
      }

      try {
        const r = await fetchJson<RankingsResponse>(
          `/api/assessments/${encodeURIComponent(selectedAssessmentId)}/rankings`
        );
        if (cancelled) return;

        setRankingsMeta(r.assessment);

        const techStack = Array.isArray(selectedAssessment?.techStack)
          ? selectedAssessment?.techStack
          : [];

        const rows: Candidate[] = (Array.isArray(r.ranking) ? r.ranking : []).map(
          (row, idx) => {
            const language = row?.submission?.language;
            const skills = [
              ...(language ? [language] : []),
              ...techStack,
            ].filter(Boolean) as string[];

            return {
              publicId: row.candidate.publicId,
              sessionId: row.sessionId,
              rank: idx + 1,
              score: row.score.score,
              skills,
              ghostAvailable: true,
              revealed: !!row.candidate.revealed,
              name: row.candidate.name,
              email: row.candidate.email,
            };
          }
        );

        setCandidates(rows);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof ApiError ? err.message : 'Failed to load rankings';
          toast({
            title: 'Unable to load leaderboard',
            description: msg,
            status: 'error',
            duration: 2500,
          });
          setCandidates([]);
          setRankingsMeta(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedAssessmentId, selectedAssessment, toast]);

  const viewGhostReplay = (publicId: string) => {
    router.push(`/recruiter/replay/${publicId}`);
  };

  const unlockCandidate = async (publicId: string) => {
    try {
      await fetchJson(`/api/candidates/${encodeURIComponent(publicId)}/reveal`, {
        method: 'POST',
      });
      // Refresh rankings so the row shows revealed PII.
      const r = await fetchJson<RankingsResponse>(
        `/api/assessments/${encodeURIComponent(selectedAssessmentId)}/rankings`
      );
      setRankingsMeta(r.assessment);
      const techStack = Array.isArray(selectedAssessment?.techStack)
        ? selectedAssessment?.techStack
        : [];
      setCandidates(
        (Array.isArray(r.ranking) ? r.ranking : []).map((row, idx) => {
          const language = row?.submission?.language;
          const skills = [
            ...(language ? [language] : []),
            ...techStack,
          ].filter(Boolean) as string[];

          return {
            publicId: row.candidate.publicId,
            sessionId: row.sessionId,
            rank: idx + 1,
            score: row.score.score,
            skills,
            ghostAvailable: true,
            revealed: !!row.candidate.revealed,
            name: row.candidate.name,
            email: row.candidate.email,
          };
        })
      );

      toast({
        title: 'Identity revealed',
        description: 'Candidate profile is now unlocked.',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Reveal failed';
      toast({
        title: 'Unlock failed',
        description: msg,
        status: 'error',
        duration: 2500,
      });
    }
  };

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="#0A0A0F">
        <Spinner size="xl" color="#C8F135" />
      </Flex>
    );
  }

  const visibleCandidates = candidates.filter((c) => c.score >= meritThreshold);
  const avgMerit = average(candidates.map((c) => c.score));

  return (
    <Box minH="100vh" bg="#0A0A0F">
      {/* Header */}
      <Box borderBottom="1px solid rgba(255,255,255,0.08)" bg="rgba(10,10,15,0.8)" backdropFilter="blur(20px)" position="sticky" top={0} zIndex={10}>
        <Flex maxW="1400px" mx="auto" px={8} py={4} justify="space-between" align="center">
          <HStack spacing={3}>
            <Box w={8} h={8} bg="#C8F135" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
              <CpuChipIcon className="w-4 h-4 text-black" />
            </Box>
            <Text fontWeight="bold" fontSize="xl" fontFamily="'Cabinet Grotesk', sans-serif">SkillProof</Text>
          </HStack>
          <Badge bg="rgba(124,58,237,0.1)" color="#7C3AED" px={3} py={1} borderRadius="full">
            Recruiter Mode
          </Badge>
        </Flex>
      </Box>

      <Box maxW="1400px" mx="auto" px={8} py={10}>
        {/* AI-Orchestrated Task Creator (JD -> Assessment) */}
        <Card bg="rgba(255,255,255,0.03)" border="1px solid rgba(255,255,255,0.06)" borderRadius="2xl" mb={8}>
          <CardBody>
            <HStack justify="space-between" align="start" spacing={6} flexWrap="wrap">
              <Box>
                <Heading fontSize="xl">AI Task Creator</Heading>
                <Text color="rgba(255,255,255,0.5)" fontSize="sm" mt={1}>
                  Paste a Job Description. The system generates an assessment draft with tasks, hidden tests, and a rubric (Groq if configured).
                </Text>
              </Box>
              {generated?.assessment?.id ? (
                <Button
                  as={NextLink}
                  href={`/assessments/${generated.assessment.id}`}
                  size="sm"
                  variant="outline"
                  borderColor="rgba(200,241,53,0.3)"
                  color="#C8F135"
                  _hover={{ bg: 'rgba(200,241,53,0.1)' }}
                >
                  Open Leaderboard
                </Button>
              ) : null}
            </HStack>

            <Divider my={5} borderColor="rgba(255,255,255,0.08)" />

            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here…"
              minH="140px"
              bg="rgba(0,0,0,0.25)"
              borderColor="rgba(255,255,255,0.08)"
              _hover={{ borderColor: 'rgba(255,255,255,0.18)' }}
              _focus={{ borderColor: 'rgba(200,241,53,0.4)', boxShadow: 'none' }}
            />

            <HStack mt={4} justify="space-between" flexWrap="wrap" spacing={4}>
              <Text fontSize="sm" color="rgba(255,255,255,0.4)">
                {generated ? `Draft source: ${generated.draftSource}` : 'No draft generated yet'}
              </Text>
              <Button
                size="sm"
                bg="#C8F135"
                color="black"
                _hover={{ bg: '#b5dc1f' }}
                isLoading={isGenerating}
                loadingText="Generating"
                onClick={async () => {
                  if (!jobDescription || jobDescription.trim().length < 20) {
                    toast({
                      title: 'Add a longer Job Description',
                      description: 'Minimum 20 characters',
                      status: 'warning',
                      duration: 2000,
                    });
                    return;
                  }

                  setIsGenerating(true);
                  setGenerated(null);
                  try {
                    const res = await fetch('/api/assessments/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        jobDescription,
                        titleHint: 'Recruiter-generated assessment',
                        tasksCount: 2,
                        difficulty: 'medium',
                        revealThreshold: 70,
                      }),
                    });

                    const data = (await res.json()) as GeneratedAssessment;
                    if (!res.ok) {
                      throw new Error((data as any)?.error?.message || (data as any)?.message || 'Generation failed');
                    }

                    setGenerated(data);
                    toast({
                      title: 'Assessment generated',
                      description: `Created: ${data.assessment.title}`,
                      status: 'success',
                      duration: 2000,
                    });
                  } catch (err: any) {
                    toast({
                      title: 'Generation failed',
                      description: err?.message || 'Something went wrong',
                      status: 'error',
                      duration: 2500,
                    });
                  } finally {
                    setIsGenerating(false);
                  }
                }}
              >
                Generate Assessment
              </Button>
            </HStack>

            {generated?.assessment?.tasks?.length ? (
              <Box mt={6} borderTop="1px solid rgba(255,255,255,0.08)" pt={5}>
                <Text fontWeight="bold" mb={2}>Generated tasks</Text>
                <VStack align="stretch" spacing={3}>
                  {generated.assessment.tasks.map((t, idx) => (
                    <Box key={idx} p={4} bg="rgba(255,255,255,0.03)" border="1px solid rgba(255,255,255,0.06)" borderRadius="xl">
                      <Text fontWeight="bold">{t.title}</Text>
                      <Text mt={2} fontSize="sm" color="rgba(255,255,255,0.5)" noOfLines={4}>
                        {t.prompt}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            ) : null}
          </CardBody>
        </Card>

        {/* Header */}
        <VStack align="flex-start" mb={8}>
          <Heading fontSize="3rem" fontFamily="'Bebas Neue', sans-serif" fontWeight={400} letterSpacing="-0.02em">
            BLIND HIRING <Box as="span" color="#C8F135">LEADERBOARD</Box>
          </Heading>
          <Text color="rgba(255,255,255,0.5)">No names. No universities. Just pure merit.</Text>
        </VStack>

        <Card bg="rgba(255,255,255,0.03)" border="1px solid rgba(255,255,255,0.06)" borderRadius="2xl" mb={8}>
          <CardBody>
            <HStack justify="space-between" flexWrap="wrap" spacing={4}>
              <Box>
                <Text fontWeight="bold">Assessment</Text>
                <Text fontSize="sm" color="rgba(255,255,255,0.4)">
                  {rankingsMeta ? rankingsMeta.title : 'Select an assessment to view rankings'}
                </Text>
              </Box>
              <Box minW={{ base: '100%', md: '420px' }}>
                <Select
                  value={selectedAssessmentId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedAssessmentId(id);
                    const a = assessments.find((x) => x.id === id) || null;
                    setSelectedAssessment(a);
                  }}
                  bg="rgba(0,0,0,0.25)"
                  borderColor="rgba(255,255,255,0.08)"
                >
                  {assessments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </Select>
              </Box>
            </HStack>
          </CardBody>
        </Card>

        {/* Merit Threshold Slider */}
        <Card bg="rgba(255,255,255,0.03)" border="1px solid rgba(255,255,255,0.06)" borderRadius="2xl" mb={8}>
          <CardBody>
            <HStack justify="space-between" mb={4}>
              <Text fontWeight="bold">Merit Threshold</Text>
              <Badge bg="#C8F135" color="black" px={3} py={1} borderRadius="full">
                Score ≥ {meritThreshold}
              </Badge>
            </HStack>
            <Slider value={meritThreshold} onChange={setMeritThreshold} min={0} max={100} step={5}>
              <SliderTrack bg="rgba(255,255,255,0.1)">
                <SliderFilledTrack bg="#C8F135" />
              </SliderTrack>
              <SliderThumb boxSize={5} bg="#C8F135" />
            </Slider>
            <Text fontSize="sm" color="rgba(255,255,255,0.4)" mt={3}>
              {visibleCandidates.length} candidate{visibleCandidates.length !== 1 ? 's' : ''} above threshold
            </Text>
          </CardBody>
        </Card>

        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          {[
            { icon: UserGroupIcon, label: 'Active Candidates', value: candidates.length.toString(), color: '#C8F135' },
            { icon: TrophyIcon, label: 'Avg. Merit Score', value: avgMerit.toString(), color: '#7C3AED' },
            { icon: ChartBarIcon, label: 'Above Threshold', value: visibleCandidates.length.toString(), color: '#4ADE80' },
          ].map((stat, idx) => (
            <Card key={idx} bg="rgba(255,255,255,0.03)" border="1px solid rgba(255,255,255,0.06)" borderRadius="2xl">
              <CardBody>
                <HStack justify="space-between">
                  <Box>
                    <Text color="rgba(255,255,255,0.4)" fontSize="sm" textTransform="uppercase">{stat.label}</Text>
                    <Text fontSize="2.5rem" fontWeight="bold" fontFamily="'Bebas Neue', sans-serif">{stat.value}</Text>
                  </Box>
                  <Icon as={stat.icon} w={8} h={8} color={stat.color} opacity={0.7} />
                </HStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Candidates Table */}
        <Card bg="rgba(255,255,255,0.03)" border="1px solid rgba(255,255,255,0.06)" borderRadius="2xl" overflow="hidden">
          <Box overflowX="auto">
            <Table variant="unstyled">
              <Thead bg="rgba(0,0,0,0.3)">
                <Tr>
                  <Th color="rgba(255,255,255,0.5)" fontFamily="'Space Mono', monospace" fontSize="xs">RANK</Th>
                  <Th color="rgba(255,255,255,0.5)" fontFamily="'Space Mono', monospace" fontSize="xs">CANDIDATE</Th>
                  <Th color="rgba(255,255,255,0.5)" fontFamily="'Space Mono', monospace" fontSize="xs">MERIT SCORE</Th>
                  <Th color="rgba(255,255,255,0.5)" fontFamily="'Space Mono', monospace" fontSize="xs">SKILLS</Th>
                  <Th color="rgba(255,255,255,0.5)" fontFamily="'Space Mono', monospace" fontSize="xs">ACTIONS</Th>
                </Tr>
              </Thead>
              <Tbody>
                {visibleCandidates.map((candidate) => (
                  <Tr key={candidate.publicId} borderBottom="1px solid rgba(255,255,255,0.04)">
                    <Td fontFamily="'Space Mono', monospace" fontWeight="bold">#{candidate.rank}</Td>
                    <Td>
                      <HStack>
                        <Icon as={LockClosedIcon} w={3} h={3} color="rgba(255,255,255,0.3)" />
                        <Text fontFamily="'Space Mono', monospace">Candidate #{candidate.publicId}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge bg="rgba(200,241,53,0.1)" color="#C8F135" fontSize="md" px={2} py={1}>
                        {candidate.score}/100
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        {candidate.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} bg="rgba(255,255,255,0.1)" fontSize="xs" px={2}>
                            {skill}
                          </Badge>
                        ))}
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing={3}>
                        {candidate.ghostAvailable && (
                          <Button
                            size="sm"
                            variant="outline"
                            borderColor="rgba(200,241,53,0.3)"
                            color="#C8F135"
                            _hover={{ bg: 'rgba(200,241,53,0.1)' }}
                            rightIcon={<EyeIcon className="w-3 h-3" />}
                            onClick={() => viewGhostReplay(candidate.publicId)}
                          >
                            Ghost Replay
                          </Button>
                        )}
                        {candidate.score >= meritThreshold && (
                          <Button
                            size="sm"
                            bg="#C8F135"
                            color="black"
                            _hover={{ bg: '#b5dc1f' }}
                            onClick={() => unlockCandidate(candidate.publicId)}
                          >
                            Unlock Profile
                          </Button>
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Card>

        {/* No candidates message */}
        {visibleCandidates.length === 0 && (
          <Card bg="rgba(255,255,255,0.03)" border="1px solid rgba(255,255,255,0.06)" borderRadius="2xl" textAlign="center" py={12}>
            <CardBody>
              <LockClosedIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <Text color="rgba(255,255,255,0.5)">No candidates above your merit threshold yet.</Text>
              <Text fontSize="sm" color="rgba(255,255,255,0.3)">Lower the threshold to see more candidates.</Text>
            </CardBody>
          </Card>
        )}
      </Box>
    </Box>
  );
}