'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner, Center, Box } from '@chakra-ui/react';
import { fetchJson } from '../lib/fetchJson';

type MeResponse = {
  user: {
    role?: string;
  };
};

export default function DashboardRouter() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const me = await fetchJson<MeResponse>('/api/auth/me');
        const role = String(me?.user?.role || '').toLowerCase();

        if (role) localStorage.setItem('userRole', role);

        if (cancelled) return;

        if (role === 'recruiter') {
          router.push('/dashboard/recruiter');
        } else if (role === 'candidate') {
          router.push('/dashboard/candidate');
        } else {
          router.push('/login');
        }
      } catch {
        if (!cancelled) router.push('/login');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <Center h="100vh" bg="#0A0A0F">
      <Box textAlign="center">
        <Spinner size="xl" color="#C8F135" thickness="3px" />
      </Box>
    </Center>
  );
}