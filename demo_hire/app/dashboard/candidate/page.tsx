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
  SimpleGrid,
  Card,
  CardBody,
  Spinner,
  useToast,
  Badge,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  TrophyIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { CandidateSidebar } from '@/app/component/candidate-sidebar';
import { ApiError, fetchJson } from '../../lib/fetchJson';

interface Assessment {
  id: string;
  title: string;
  description?: string;
  revealThreshold?: number;
}

type DashboardResponse = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role?: string;
  };
  candidate: {
    publicId: string;
    revealed: boolean;
  };
  pendingInvites: Assessment[];
  completed: Array<{
    sessionId: string;
    assessment: {
      id: string;
      title: string;
      revealThreshold?: number;
    } | null;
    submittedAt?: string;
    score?: { score: number };
    submission?: { timeMs?: number | null };
  }>;
  progression: Array<{ ts: string; score: number }>;
};

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export default function CandidateDashboard() {
  const router = useRouter();
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    averageScore: 0,
    totalHours: 0,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await fetchJson<DashboardResponse>(
          '/api/candidate/me/dashboard'
        );

        const role = String(data?.user?.role || '').toLowerCase();
        if (role) localStorage.setItem('userRole', role);
        if (role !== 'candidate') {
          router.push('/login');
          return;
        }

        if (cancelled) return;

        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));

        const pending = Array.isArray(data.pendingInvites)
          ? data.pendingInvites
          : [];
        const completed = Array.isArray(data.completed) ? data.completed : [];

        setAssessments(pending);

        const totalCompleted = completed.length;
        const avgScore = totalCompleted
          ? completed.reduce((acc, s) => acc + (s?.score?.score ?? 0), 0) /
            totalCompleted
          : 0;
        const totalHours = completed.reduce((acc, s) => {
          const ms = s?.submission?.timeMs;
          return acc + (typeof ms === 'number' && ms > 0 ? ms : 0);
        }, 0);

        setStats({
          totalCompleted,
          averageScore: Math.round(avgScore),
          totalHours: round1(totalHours / 3_600_000),
        });
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Failed to load';
        toast({
          title: 'Unable to load dashboard',
          description: msg,
          status: 'error',
          duration: 2500,
        });
        router.push('/login');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, toast]);

  const startAssessment = async (assessmentId: string) => {
    router.push(`/assessment/${assessmentId}/setup`);
  };

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="#0A0A0F">
        <Spinner size="xl" color="#C8F135" />
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="#0A0A0F">
      {/* Sidebar - Desktop only */}
      <Box display={{ base: 'none', lg: 'block' }}>
        <CandidateSidebar user={user} />
      </Box>

      {/* Mobile - Sidebar component will render bottom navigation */}
      {isMobile && <CandidateSidebar user={user} />}

      {/* Main Content */}
      <Box 
        flex={1} 
        overflowX="auto" 
        pb={{ base: "80px", lg: 0 }} // Add bottom padding for mobile to account for bottom nav
        mb={{ base: 0, lg: 0 }}
      >
        <Box maxW="1400px" mx="auto" px={{ base: 4, md: 6, lg: 8 }} py={{ base: 6, md: 8, lg: 10 }}>
          {/* Welcome Section */}
          <VStack align="flex-start" mb={8}>
            <Heading 
              fontSize={{ base: "2rem", md: "2.5rem", lg: "3rem" }} 
              fontFamily="'Bebas Neue', sans-serif" 
              fontWeight={400} 
              letterSpacing="-0.02em"
            >
              Welcome back, <Box as="span" color="#C8F135">{user?.name?.split(' ')[0] || 'Engineer'}</Box>
            </Heading>
            <Text color="rgba(255,255,255,0.5)" fontSize={{ base: "sm", md: "md", lg: "lg" }}>
              Prove your skills. No résumé bias. Just pure merit.
            </Text>
          </VStack>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} mb={10}>
            {[
              { icon: TrophyIcon, label: 'Completed', value: stats.totalCompleted, color: '#C8F135' },
              { icon: ChartBarIcon, label: 'Avg. Score', value: `${stats.averageScore}%`, color: '#7C3AED' },
              { icon: ClockIcon, label: 'Hours Coded', value: stats.totalHours, color: '#4ADE80' },
            ].map((stat, idx) => (
              <Card key={idx} bg="rgba(255,255,255,0.03)" border="1px solid rgba(255,255,255,0.06)" borderRadius="2xl">
                <CardBody>
                  <HStack justify="space-between">
                    <Box>
                      <Text color="rgba(255,255,255,0.4)" fontSize="xs" textTransform="uppercase" letterSpacing=".08em">
                        {stat.label}
                      </Text>
                      <Text fontSize={{ base: "2rem", md: "2.5rem", lg: "3rem" }} fontWeight="bold" fontFamily="'Bebas Neue', sans-serif">
                        {stat.value}
                      </Text>
                    </Box>
                    <Icon as={stat.icon} w={{ base: 6, md: 8 }} h={{ base: 6, md: 8 }} color={stat.color} opacity={0.7} />
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Assessments Section */}
          <Heading fontSize="xl" mb={6} fontFamily="'Cabinet Grotesk', sans-serif">
            Available Assessments
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {assessments.map((assessment) => (
              <Card
                key={assessment.id}
                bg="rgba(255,255,255,0.03)"
                border="1px solid rgba(255,255,255,0.06)"
                borderRadius="2xl"
                _hover={{ borderColor: 'rgba(200,241,53,0.3)', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => startAssessment(assessment.id)}
              >
                <CardBody>
                  <HStack justify="space-between" mb={4}>
                    <Badge bg="rgba(200,241,53,0.1)" color="#C8F135" fontSize="xs">
                      Assessment
                    </Badge>
                  </HStack>
                  <Text fontWeight="bold" fontSize="lg" mb={2}>{assessment.title}</Text>
                  <Text color="rgba(255,255,255,0.4)" fontSize="sm" mb={4} noOfLines={2}>
                    {assessment.description || ''}
                  </Text>
                  <Button
                    rightIcon={<ArrowRightIcon className="w-3 h-3" />}
                    size="sm"
                    variant="outline"
                    borderColor="rgba(255,255,255,0.2)"
                    _hover={{ borderColor: '#C8F135', bg: 'rgba(200,241,53,0.05)' }}
                    w="full"
                  >
                    Start Assessment
                  </Button>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Flex>
  );
}