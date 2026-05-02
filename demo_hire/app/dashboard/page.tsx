'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner, Center, Box } from '@chakra-ui/react';

export default function DashboardRouter() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      router.push('/login');
      return;
    }

    // Route based on role
    if (userRole === 'recruiter') {
      router.push('/dashboard/recruiter');
    } else if (userRole === 'candidate') {
      router.push('/dashboard/candidate');
    } else {
      // Fallback to login if role is invalid
      router.push('/login');
    }
  }, [router]);

  return (
    <Center h="100vh" bg="#0A0A0F">
      <Box textAlign="center">
        <Spinner size="xl" color="#C8F135" thickness="3px" />
      </Box>
    </Center>
  );
}