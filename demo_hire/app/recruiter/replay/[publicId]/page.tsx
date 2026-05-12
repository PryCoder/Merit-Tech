'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Center, Spinner } from '@chakra-ui/react';

export default function RecruiterReplayRedirectPage() {
  const router = useRouter();
  const params = useParams<{ publicId: string }>();
  const publicId = params?.publicId;

  React.useEffect(() => {
    if (!publicId) return;
    router.replace(`/candidate/${encodeURIComponent(publicId)}`);
  }, [publicId, router]);

  return (
    <Center h="100dvh" bg="var(--background)">
      <Spinner />
    </Center>
  );
}
