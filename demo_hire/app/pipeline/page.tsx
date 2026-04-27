'use client';

import NextLink from 'next/link';
import React from 'react';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ApiError, fetchJson } from '../lib/fetchJson';

type PipelineResponse = {
  stages: string[];
  byStage: Record<
    string,
    Array<{ publicId: string; name?: string | null; email?: string | null }>
  >;
};

export default function PipelinePage() {
  const [data, setData] = React.useState<PipelineResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function refresh() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchJson<PipelineResponse>('/api/pipeline');
      setData(res);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load pipeline'
      );
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    refresh();
  }, []);

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
      <Container maxW="6xl" py={{ base: 10, md: 14 }}>
        <HStack
          justify="space-between"
          align="start"
          spacing={6}
          flexWrap="wrap"
        >
          <Box>
            <Link
              as={NextLink}
              href="/dashboard"
              color="brand.600"
              fontWeight={600}
            >
              ← Back to dashboard
            </Link>
            <Heading
              mt={3}
              fontFamily="var(--font-playfair)"
              fontSize={{ base: '3xl', md: '4xl' }}
            >
              Hiring Pipeline
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="80ch">
              Drag unlocked candidates across interview stages.
            </Text>
          </Box>

          <HStack spacing={3} pt={2}>
            <Badge
              bg="brand.100"
              color="brand.700"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
            >
              /pipeline
            </Badge>
            <Button variant="outline" onClick={refresh} isLoading={isLoading}>
              Refresh
            </Button>
          </HStack>
        </HStack>

        <Divider my={8} borderColor="blackAlpha.200" />

        {error ? (
          <Box
            borderWidth="1px"
            borderColor="red.200"
            bg="red.50"
            borderRadius="lg"
            px={4}
            py={3}
            mb={8}
          >
            <Text color="red.700" fontSize="sm">
              {error}
            </Text>
          </Box>
        ) : null}

        {!data ? (
          <Text color="blackAlpha.600">Loading…</Text>
        ) : (
          <HStack align="start" spacing={6} overflowX="auto" pb={2}>
            {data.stages.map((stage) => (
              <Box
                key={stage}
                minW={{ base: '280px', md: '320px' }}
                bg="white"
                borderRadius="2xl"
                borderWidth="1px"
                borderColor="blackAlpha.100"
                p={{ base: 5, md: 6 }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  const publicId = e.dataTransfer.getData('text/plain');
                  if (!publicId) return;

                  try {
                    const next = await fetchJson<PipelineResponse>(
                      '/api/pipeline/move',
                      {
                        method: 'POST',
                        body: { publicId, toStage: stage },
                      }
                    );
                    setData(next);
                  } catch (err) {
                    setError(
                      err instanceof ApiError
                        ? err.message
                        : 'Failed to move candidate'
                    );
                  }
                }}
              >
                <HStack justify="space-between" align="start" spacing={4}>
                  <Heading as="h2" fontSize="lg">
                    {stage}
                  </Heading>
                  <Badge variant="subtle" colorScheme="gray">
                    {(data.byStage?.[stage] || []).length}
                  </Badge>
                </HStack>

                <Stack mt={5} spacing={3}>
                  {(data.byStage?.[stage] || []).length === 0 ? (
                    <Text color="blackAlpha.600" fontSize="sm">
                      No candidates.
                    </Text>
                  ) : null}

                  {(data.byStage?.[stage] || []).map((c) => (
                    <Box
                      key={c.publicId}
                      borderWidth="1px"
                      borderColor="blackAlpha.100"
                      borderRadius="xl"
                      p={4}
                      bg="blackAlpha.50"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', c.publicId);
                      }}
                    >
                      <Text fontWeight={700}>{c.name || c.publicId}</Text>
                      <Text
                        mt={1}
                        color="blackAlpha.700"
                        fontSize="sm"
                        fontFamily="var(--font-geist-mono)"
                      >
                        {c.publicId}
                      </Text>
                      <Text mt={1} color="blackAlpha.700" fontSize="sm">
                        {c.email || 'Resume: —'}
                      </Text>

                      <Button
                        as={NextLink}
                        href={`/candidate/${encodeURIComponent(c.publicId)}`}
                        size="sm"
                        variant="outline"
                        mt={3}
                      >
                        Open profile
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </HStack>
        )}
      </Container>
    </Box>
  );
}
