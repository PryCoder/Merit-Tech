'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Button,
  Avatar,
  Divider,
  useBreakpointValue,
  Flex,
  Tooltip,
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
import {
  HomeIcon as HomeIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  TrophyIcon as TrophyIconSolid,
  FolderOpenIcon as FolderOpenIconSolid,
} from '@heroicons/react/24/solid';

interface CandidateSidebarProps {
  user: any;
  onClose?: () => void;
}

export function CandidateSidebar({ user, onClose }: CandidateSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState(user);
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const isSmallMobile = useBreakpointValue({ base: true, sm: false });

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
    { id: 'dashboard', label: 'Home', icon: HomeIcon, iconSolid: HomeIconSolid, path: '/dashboard/candidate' },
    { id: 'assessments', label: 'Assess', icon: ClipboardDocumentListIcon, iconSolid: ClipboardDocumentListIconSolid, path: '/dashboard/candidate/assessments' },
    { id: 'my-submissions', label: 'Submissions', icon: FolderOpenIcon, iconSolid: FolderOpenIconSolid, path: '/dashboard/candidate/submissions' },
    { id: 'leaderboard', label: 'Leaderboard', icon: TrophyIcon, iconSolid: TrophyIconSolid, path: '/dashboard/candidate/leaderboard' },
    { id: 'profile', label: 'Profile', icon: UserCircleIcon, iconSolid: UserCircleIconSolid, path: '/dashboard/candidate/profile' },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid, path: '/dashboard/candidate/settings' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getActiveTab = () => {
    const currentPath = pathname;
    const activeItem = menuItems.find(item => currentPath === item.path);
    return activeItem?.id || 'dashboard';
  };

  const activeTab = getActiveTab();

  // MOBILE VIEW - Custom Horizontal Bottom Navigation Bar
  if (!isDesktop) {
    return (
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1000}
        bg="rgba(10,10,15,0.95)"
        backdropFilter="blur(20px)"
        borderTop="1px solid rgba(255,255,255,0.08)"
        boxShadow="0 -4px 20px rgba(0,0,0,0.3)"
        px={2}
        py={2}
      >
        <Flex
          justify="space-around"
          align="center"
          maxW="100%"
          overflowX="auto"
          sx={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = isActive ? item.iconSolid : item.icon;
            
            return (
              <Tooltip key={item.id} label={item.label} placement="top" hasArrow>
                <Button
                  variant="ghost"
                  onClick={() => handleNavigation(item.path)}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                  p={2}
                  minW={{ base: "60px", sm: "70px" }}
                  h="auto"
                  bg={isActive ? 'rgba(200,241,53,0.15)' : 'transparent'}
                  color={isActive ? '#C8F135' : 'rgba(255,255,255,0.6)'}
                  _hover={{
                    bg: 'rgba(200,241,53,0.1)',
                    color: '#C8F135',
                    transform: 'translateY(-2px)',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s ease"
                  borderRadius="xl"
                  position="relative"
                >
                  <Icon 
                    as={IconComponent} 
                    w={{ base: 5, sm: 6 }} 
                    h={{ base: 5, sm: 6 }} 
                  />
                  <Text 
                    fontSize={{ base: "10px", sm: "12px" }} 
                    fontWeight={isActive ? "semibold" : "normal"}
                    display={{ base: "none", xs: "block" }}
                  >
                    {isSmallMobile && item.label === 'Assess' ? 'Test' : 
                     isSmallMobile && item.label === 'Submissions' ? 'Work' : 
                     isSmallMobile && item.id === 'my-submissions' ? 'Work' :
                     item.label === 'Assessments' ? 'Assess' : 
                     item.label === 'My Submissions' ? 'Work' : 
                     item.label}
                  </Text>
                  {isActive && (
                    <Box
                      position="absolute"
                      bottom="-2px"
                      left="50%"
                      transform="translateX(-50%)"
                      w="20px"
                      h="2px"
                      bg="#C8F135"
                      borderRadius="full"
                    />
                  )}
                </Button>
              </Tooltip>
            );
          })}
          
          {/* Logout Button on Mobile */}
          <Tooltip label="Logout" placement="top" hasArrow>
            <Button
              variant="ghost"
              onClick={handleLogout}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={1}
              p={2}
              minW={{ base: "60px", sm: "70px" }}
              h="auto"
              color="rgba(255,255,255,0.5)"
              _hover={{
                bg: 'rgba(255,77,109,0.1)',
                color: '#FF4D6D',
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s ease"
              borderRadius="xl"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <Text fontSize={{ base: "10px", sm: "12px" }} display={{ base: "none", xs: "block" }}>
                Exit
              </Text>
            </Button>
          </Tooltip>
        </Flex>
      </Box>
    );
  }

  // DESKTOP VIEW - Full Sidebar
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
      w="280px"
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
            onClick={() => handleNavigation(item.path)}
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