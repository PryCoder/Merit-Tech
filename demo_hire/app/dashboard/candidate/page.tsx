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
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import {
  TrophyIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CpuChipIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { CandidateSidebar } from '@/app/component/candidate-sidebar';

interface Assessment {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export default function CandidateDashboard() {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    averageScore: 0,
    totalHours: 0,
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'candidate') {
      router.push('/login');
      return;
    }

    fetchUserProfile(token);
    fetchAssessments(token);
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchAssessments = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/assessments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.assessments) {
        setAssessments(data.assessments);
      } else {
        // Mock data
        setAssessments([
          { _id: '1', title: 'Two Sum Problem', description: 'Find two numbers that add up to target', difficulty: 'Easy', category: 'Arrays' },
          { _id: '2', title: 'LRU Cache Implementation', description: 'Implement Least Recently Used cache', difficulty: 'Medium', category: 'Data Structures' },
          { _id: '3', title: 'Real-time Chat Server', description: 'Build a WebSocket chat server', difficulty: 'Hard', category: 'System Design' },
          { _id: '4', title: 'Merge K Sorted Lists', description: 'Merge k sorted linked lists', difficulty: 'Hard', category: 'Linked Lists' },
        ]);
      }
      setStats({
        totalCompleted: 3,
        averageScore: 87,
        totalHours: 24,
      });
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      setAssessments([
        { _id: '1', title: 'Two Sum Problem', description: 'Find two numbers that add up to target', difficulty: 'Easy', category: 'Arrays' },
        { _id: '2', title: 'LRU Cache Implementation', description: 'Implement Least Recently Used cache', difficulty: 'Medium', category: 'Data Structures' },
        { _id: '3', title: 'Real-time Chat Server', description: 'Build a WebSocket chat server', difficulty: 'Hard', category: 'System Design' },
      ]);
      setStats({
        totalCompleted: 3,
        averageScore: 87,
        totalHours: 24,
      });
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = async (assessmentId: string) => {
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_BASE}/api/v1/assessments/${assessmentId}/sessions/self`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      
      if (res.ok && data.sessionId) {
        router.push(`/assessment/${assessmentId}/session/${data.sessionId}`);
      } else {
        router.push(`/assessment/${assessmentId}`);
      }
    } catch (error) {
      router.push(`/assessment/${assessmentId}`);
    }
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
      {/* Desktop Sidebar */}
      {!isMobile && <CandidateSidebar user={user} />}

      {/* Mobile Drawer Button */}
      {isMobile && (
        <IconButton
          aria-label="Open menu"
          icon={<Bars3Icon className="w-5 h-5" />}
          position="fixed"
          top={4}
          left={4}
          zIndex={20}
          bg="rgba(0,0,0,0.8)"
          backdropFilter="blur(10px)"
          onClick={onOpen}
          _hover={{ bg: 'rgba(0,0,0,0.9)' }}
        />
      )}

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg="#0A0A0F" borderRight="1px solid rgba(255,255,255,0.06)">
          <DrawerBody p={0}>
            <CandidateSidebar user={user} onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box flex={1} overflowX="auto">
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
                key={assessment._id}
                bg="rgba(255,255,255,0.03)"
                border="1px solid rgba(255,255,255,0.06)"
                borderRadius="2xl"
                _hover={{ borderColor: 'rgba(200,241,53,0.3)', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => startAssessment(assessment._id)}
              >
                <CardBody>
                  <HStack justify="space-between" mb={4}>
                    <Badge
                      px={2}
                      py={1}
                      borderRadius="md"
                      bg={assessment.difficulty === 'Easy' ? 'rgba(74,222,128,0.1)' : assessment.difficulty === 'Medium' ? 'rgba(251,191,36,0.1)' : 'rgba(255,77,109,0.1)'}
                      color={assessment.difficulty === 'Easy' ? '#4ADE80' : assessment.difficulty === 'Medium' ? '#FBBF24' : '#FF4D6D'}
                      fontSize="xs"
                    >
                      {assessment.difficulty}
                    </Badge>
                    <Badge bg="rgba(200,241,53,0.1)" color="#C8F135" fontSize="xs">
                      {assessment.category}
                    </Badge>
                  </HStack>
                  <Text fontWeight="bold" fontSize="lg" mb={2}>{assessment.title}</Text>
                  <Text color="rgba(255,255,255,0.4)" fontSize="sm" mb={4} noOfLines={2}>
                    {assessment.description}
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