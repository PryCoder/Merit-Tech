'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@chakra-ui/react';
import {
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  EyeIcon,
  LockClosedIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

interface Candidate {
  id: string;
  rank: number;
  score: number;
  skills: string[];
  ghostAvailable: boolean;
}

export default function RecruiterDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [meritThreshold, setMeritThreshold] = useState(75);
  const [candidates] = useState<Candidate[]>([
    { id: '004', rank: 1, score: 94, skills: ['Hash Maps', 'Algorithms'], ghostAvailable: true },
    { id: '007', rank: 2, score: 88, skills: ['System Design', 'Databases'], ghostAvailable: true },
    { id: '012', rank: 3, score: 82, skills: ['React', 'WebSockets'], ghostAvailable: true },
    { id: '019', rank: 4, score: 76, skills: ['Python', 'APIs'], ghostAvailable: false },
    { id: '023', rank: 5, score: 71, skills: ['JavaScript'], ghostAvailable: false },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'recruiter') {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, []);

  const viewGhostReplay = (candidateId: string) => {
    router.push(`/recruiter/replay/${candidateId}`);
  };

  const unlockCandidate = (candidateId: string) => {
    // This would call an API to decrypt PII
    alert(`Unlock feature: View full profile of Candidate #${candidateId}\n(This would reveal email, name, GitHub after payment)`);
  };

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="#0A0A0F">
        <Spinner size="xl" color="#C8F135" />
      </Flex>
    );
  }

  const visibleCandidates = candidates.filter(c => c.score >= meritThreshold);

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
        {/* Header */}
        <VStack align="flex-start" mb={8}>
          <Heading fontSize="3rem" fontFamily="'Bebas Neue', sans-serif" fontWeight={400} letterSpacing="-0.02em">
            BLIND HIRING <Box as="span" color="#C8F135">LEADERBOARD</Box>
          </Heading>
          <Text color="rgba(255,255,255,0.5)">No names. No universities. Just pure merit.</Text>
        </VStack>

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
            { icon: TrophyIcon, label: 'Avg. Merit Score', value: '82', color: '#7C3AED' },
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
                  <Tr key={candidate.id} borderBottom="1px solid rgba(255,255,255,0.04)">
                    <Td fontFamily="'Space Mono', monospace" fontWeight="bold">#{candidate.rank}</Td>
                    <Td>
                      <HStack>
                        <Icon as={LockClosedIcon} w={3} h={3} color="rgba(255,255,255,0.3)" />
                        <Text fontFamily="'Space Mono', monospace">Candidate #{candidate.id}</Text>
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
                            onClick={() => viewGhostReplay(candidate.id)}
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
                            onClick={() => unlockCandidate(candidate.id)}
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