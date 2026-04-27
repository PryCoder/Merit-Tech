'use client';

import React from 'react';
import NextLink from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';

export default function AssessmentResultsPage() {
  const params = useParams<{ assessmentId: string }>();
  const assessmentId = params?.assessmentId;
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('sessionId') ?? '';

  if (!assessmentId) {
    return (
      <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
        <Container maxW="5xl" py={{ base: 10, md: 14 }}>
          <Stack spacing={4}>
            <Heading
              fontFamily="var(--font-playfair)"
              fontSize={{ base: '3xl', md: '4xl' }}
            >
              Results
            </Heading>
            <Text color="blackAlpha.700">Missing assessment id.</Text>
            <Button as={NextLink} href="/dashboard" variant="outline" alignSelf="start">
              Back to dashboard
            </Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
      <Container maxW="5xl" py={{ base: 10, md: 14 }}>
        <HStack
          justify="space-between"
          align="start"
          spacing={6}
          flexWrap="wrap"
        >
          <Box>
            <Badge
              bg="brand.100"
              color="brand.700"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
            >
              Candidate Portal
            </Badge>
            <Heading
              mt={3}
              fontFamily="var(--font-playfair)"
              fontSize={{ base: '3xl', md: '4xl' }}
            >
              Results
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="70ch">
              MVP placeholder: show score/time/tests and mentor feedback.
            </Text>
          </Box>

          <HStack spacing={3} pt={2}>
            <Button as={NextLink} href="/dashboard" variant="outline">
              Back to dashboard
            </Button>
            <Button
              as={NextLink}
              href={`/assessment/${assessmentId}/setup`}
              colorScheme="green"
              bg="brand.600"
              _hover={{ bg: 'brand.700' }}
            >
              Retry (new session)
            </Button>
          </HStack>
        </HStack>

        <Divider my={8} borderColor="blackAlpha.200" />

        <Stack spacing={6}>
          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <Heading as="h2" fontSize="2xl">
              Summary
            </Heading>
            <Divider my={6} />
            <Text color="blackAlpha.700">
              Assessment:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {assessmentId}
              </Box>
            </Text>
            <Text color="blackAlpha.700" mt={2}>
              Session:{' '}
              <Box as="span" fontFamily="var(--font-geist-mono)">
                {sessionId || '—'}
              </Box>
            </Text>
            <Text color="blackAlpha.600" mt={4} fontSize="sm">
              Next step: wire this to a backend “get session results” endpoint
              and render merit score, AI dependency index, test cases, and
              mentor feedback.
            </Text>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
