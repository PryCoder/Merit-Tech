'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import {
  CpuChipIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  TrophyIcon,
  FolderOpenIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface CandidateSidebarProps {
  user: any;
  onClose?: () => void;
}

export function CandidateSidebar({ user, onClose }: CandidateSidebarProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    const stored = localStorage.getItem('user');

    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error('Invalid user data in localStorage');
      }
    }
  }, []);

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, path: '/dashboard/candidate' },
  { id: 'assessments', label: 'Assessments', icon: ClipboardDocumentListIcon, path: '/dashboard/candidate/assessments' },
  { id: 'my-submissions', label: 'My Submissions', icon: FolderOpenIcon, path: '/dashboard/candidate/submissions' },
  { id: 'leaderboard', label: 'Leaderboard', icon: TrophyIcon, path: '/dashboard/candidate/leaderboard' },
  { id: 'profile', label: 'Profile', icon: UserCircleIcon, path: '/dashboard/candidate/profile' },
  { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, path: '/dashboard/candidate/settings' },
];

const handleNavigation = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <VStack
      align="stretch"
      h="100vh"
      bg="rgba(10,10,15,0.98)"
      borderRight="1px solid rgba(255,255,255,0.06)"
      py={6}
      px={4}
      position="sticky"
      top={0}
      w={{ base: "100%", lg: "280px" }}
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.02)' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '4px' },
      }}
    >
      {/* Logo */}
      <HStack spacing={3} px={3} pb={6} mb={4} borderBottom="1px solid rgba(255,255,255,0.06)">
        <Box 
          w={10} 
          h={10} 
          bg="#C8F135" 
          borderRadius="xl" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
        >
          <CpuChipIcon className="w-5 h-5 text-black" />
        </Box>
        <Text fontWeight="bold" fontSize="xl" fontFamily="'Cabinet Grotesk', sans-serif">
          SkillProof
        </Text>
      </HStack>

      {/* User Info */}
      <HStack spacing={3} px={3} py={4} mb={4} bg="rgba(255,255,255,0.03)" borderRadius="xl">
        <Avatar
          size="sm"
          name={currentUser?.name || 'Candidate'}
          bg="#C8F135"
          color="black"
        />
        <Box flex={1}>
          <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
            {currentUser?.name || 'Candidate'}
          </Text>
          <Text fontSize="xs" color="rgba(255,255,255,0.4)" noOfLines={1}>
            {currentUser?.email || 'candidate@example.com'}
          </Text>
        </Box>
      </HStack>

      {/* Navigation Menu */}
      <VStack align="stretch" spacing={1} flex={1}>
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            justifyContent="flex-start"
            leftIcon={<Icon as={item.icon} w={5} h={5} />}
            rightIcon={activeTab === item.id ? <ChevronRightIcon className="w-4 h-4" /> : undefined}
            onClick={() => {
              setActiveTab(item.id);
              handleNavigation(item.path);
            }}
            bg={activeTab === item.id ? 'rgba(200,241,53,0.1)' : 'transparent'}
            color={activeTab === item.id ? '#C8F135' : 'rgba(255,255,255,0.7)'}
            _hover={{ bg: 'rgba(255,255,255,0.05)', color: 'white' }}
            borderRadius="lg"
            py={2}
            fontWeight="normal"
          >
            {item.label}
          </Button>
        ))}
      </VStack>

      {/* Logout Button */}
      <Divider borderColor="rgba(255,255,255,0.06)" my={4} />
      
      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<ArrowLeftOnRectangleIcon className="w-5 h-5" />}
        onClick={handleLogout}
        color="rgba(255,255,255,0.5)"
        _hover={{ bg: 'rgba(255,77,109,0.1)', color: '#FF4D6D' }}
        borderRadius="lg"
        py={2}
      >
        Logout
      </Button>
    </VStack>
  );
}