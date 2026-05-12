'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ApiError, fetchJson } from '../lib/fetchJson';

type MeResponse = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role?: string;
    resumeUrl?: string | null;
    githubUrl?: string | null;
    portfolioUrl?: string | null;
  };
};

type CandidateMeProfileResponse = {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role?: string;
    resumeUrl?: string | null;
    githubUrl?: string | null;
    portfolioUrl?: string | null;
  };
  candidate: {
    publicId: string;
    revealed: boolean;
    visibilityLog?: Array<{
      ts: string;
      assessmentId?: string;
      assessmentTitle?: string;
    }>;
  };
};

type UpdateProfileBody = {
  name?: string;
  resumeUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
};

export default function ProfilePage() {
  const [me, setMe] = React.useState<MeResponse['user'] | null>(null);
  const [profile, setProfile] =
    React.useState<CandidateMeProfileResponse | null>(null);

  const [name, setName] = React.useState('');
  const [resumeUrl, setResumeUrl] = React.useState('');
  const [githubUrl, setGithubUrl] = React.useState('');
  const [portfolioUrl, setPortfolioUrl] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const meRes = await fetchJson<MeResponse>('/api/auth/me');
      setMe(meRes.user);

      const profileRes = await fetchJson<CandidateMeProfileResponse>(
        '/api/candidate/me/profile'
      );
      setProfile(profileRes);

      setName(profileRes.user.name ?? '');
      setResumeUrl(profileRes.user.resumeUrl ?? '');
      setGithubUrl(profileRes.user.githubUrl ?? '');
      setPortfolioUrl(profileRes.user.portfolioUrl ?? '');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to load profile'
      );
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function save() {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const body: UpdateProfileBody = {
      name: name.trim() || undefined,
      resumeUrl: resumeUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
    };

    try {
      await fetchJson('/api/auth/me/profile', {
        method: 'PUT',
        body,
      });
      setSuccess('Saved');
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to save profile'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
        <Container maxW="4xl" py={{ base: 10, md: 14 }}>
          <Text color="blackAlpha.700">Loading…</Text>
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
              Profile
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="70ch">
              Manage your links and view your visibility history.
            </Text>
          </Box>

          <HStack spacing={3} pt={2}>
            <Button as={NextLink} href="/dashboard" variant="outline">
              Back to dashboard
            </Button>
            <Button
              onClick={save}
              isLoading={isSaving}
              colorScheme="green"
              bg="brand.600"
              _hover={{ bg: 'brand.700' }}
            >
              Save
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
            mb={6}
          >
            <Text color="red.700" fontSize="sm">
              {error}
            </Text>
          </Box>
        ) : null}
        {success ? (
          <Box
            borderWidth="1px"
            borderColor="green.200"
            bg="green.50"
            borderRadius="lg"
            px={4}
            py={3}
            mb={6}
          >
            <Text color="green.800" fontSize="sm">
              {success}
            </Text>
          </Box>
        ) : null}

        <Stack spacing={8}>
          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <Heading as="h2" fontSize="2xl">
              Basic info
            </Heading>
            <Text color="blackAlpha.700" mt={1}>
              This is tied to your authenticated account.
            </Text>

            <Divider my={6} />

            <VStack align="stretch" spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={me?.email ?? ''} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Input value={me?.role ?? ''} isReadOnly />
              </FormControl>
            </VStack>
          </Box>

          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <Heading as="h2" fontSize="2xl">
              Links
            </Heading>
            <Text color="blackAlpha.700" mt={1}>
              These help recruiters evaluate you once unlocked.
            </Text>

            <Divider my={6} />

            <VStack align="stretch" spacing={4}>
              <FormControl>
                <FormLabel>Resume URL</FormLabel>
                <Input
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://…"
                />
              </FormControl>
              <FormControl>
                <FormLabel>GitHub URL</FormLabel>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/…"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Portfolio URL</FormLabel>
                <Input
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://…"
                />
              </FormControl>
            </VStack>
          </Box>

          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
          >
            <Heading as="h2" fontSize="2xl">
              Visibility log
            </Heading>
            <Text color="blackAlpha.700" mt={1}>
              When your identity was unlocked for a specific assessment.
            </Text>

            <Divider my={6} />

            {profile?.candidate?.visibilityLog?.length ? (
              <Stack spacing={3}>
                {profile.candidate.visibilityLog
                  .slice()
                  .reverse()
                  .map((v) => (
                    <Box
                      key={`${v.ts}:${v.assessmentId ?? 'na'}`}
                      borderWidth="1px"
                      borderColor="blackAlpha.100"
                      borderRadius="xl"
                      p={4}
                    >
                      <Text fontWeight={700}>
                        {v.assessmentTitle || v.assessmentId || 'Assessment'}
                      </Text>
                      <Text
                        mt={1}
                        color="blackAlpha.600"
                        fontSize="sm"
                        fontFamily="var(--font-geist-mono)"
                      >
                        {new Date(v.ts).toLocaleString()}
                      </Text>
                    </Box>
                  ))}
              </Stack>
            ) : (
              <Text color="blackAlpha.600">No unlocks yet.</Text>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
