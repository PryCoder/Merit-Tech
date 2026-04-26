'use client'

import NextLink from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'
import { fetchJson, ApiError } from '../../lib/fetchJson'
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Select,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'

type RegisterResponse = {
  user: { email: string; name?: string | null; role?: string }
  token: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [role, setRole] = React.useState<'recruiter' | 'candidate'>('recruiter')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  function routeForRole(userRole?: string) {
    if (userRole === 'recruiter' || userRole === 'company') return '/dashboard'
    return '/dashboard'
  }

  React.useEffect(() => {
    setError(null)
  }, [name, email, password, confirmPassword, role])

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)" display="flex">
      <Container maxW="5xl" py={{ base: 10, md: 16 }}>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 10, md: 12 }}
          align="stretch"
        >
          <Box
            flex={1}
            borderWidth="1px"
            borderColor="blackAlpha.100"
            borderRadius="2xl"
            bg="whiteAlpha.700"
            px={{ base: 6, md: 10 }}
            py={{ base: 8, md: 10 }}
          >
            <VStack align="start" spacing={5}>
              <Text
                fontFamily="var(--font-space-grotesk)"
                fontWeight="600"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color="blackAlpha.700"
                fontSize="sm"
              >
                Create your workspace
              </Text>
              <Heading
                as="h1"
                fontFamily="var(--font-playfair)"
                fontWeight="700"
                fontSize={{ base: '3xl', md: '4xl' }}
                lineHeight="1.05"
              >
                Start measuring merit.
                <Box as="span" display="block" color="brand.600">
                  Not pedigree.
                </Box>
              </Heading>
              <Text color="blackAlpha.700" fontSize="lg" maxW="44ch">
                Build assessments, invite candidates, and unlock identity only when a threshold is
                earned.
              </Text>

              <Stack spacing={3} pt={2} color="blackAlpha.700">
                <Text fontFamily="var(--font-jakarta)">• Invite-only mentor tools</Text>
                <Text fontFamily="var(--font-jakarta)">• Configurable reveal thresholds</Text>
                <Text fontFamily="var(--font-jakarta)">• Repeatable scoring and fairness</Text>
              </Stack>
            </VStack>
          </Box>

          <Box
            flex={1}
            borderWidth="1px"
            borderColor="blackAlpha.100"
            borderRadius="2xl"
            bg="white"
            px={{ base: 6, md: 10 }}
            py={{ base: 8, md: 10 }}
          >
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading as="h2" fontSize={{ base: '2xl', md: '3xl' }}>
                  Register
                </Heading>
                <Text color="blackAlpha.700" mt={1}>
                  Create an account to continue.
                </Text>
              </Box>

              <Box
                as="form"
                onSubmit={async (e: React.FormEvent) => {
                  e.preventDefault()

                  if (password !== confirmPassword) {
                    setError('Passwords do not match.')
                    return
                  }

                  setIsSubmitting(true)
                  setError(null)

                  try {
                    const result = await fetchJson<RegisterResponse>('/api/auth/register', {
                      method: 'POST',
                      body: { name, email, password, role },
                    })

                    router.push(routeForRole(result.user.role))
                  } catch (err) {
                    if (err instanceof ApiError) {
                      setError(err.message)
                    } else {
                      setError('Something went wrong. Please try again.')
                    }
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
              >
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Full name</FormLabel>
                    <Input
                      placeholder="Your name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      isDisabled={isSubmitting}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isDisabled={isSubmitting}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Select value={role} onChange={(e) => setRole(e.target.value as any)} isDisabled={isSubmitting}>
                      <option value="recruiter">Recruiter</option>
                      <option value="candidate">Candidate</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isDisabled={isSubmitting}
                    />
                    <FormHelperText color="blackAlpha.600">
                      Use at least 8 characters.
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Confirm password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      isDisabled={isSubmitting}
                    />
                  </FormControl>

                  {error ? (
                    <Box
                      borderWidth="1px"
                      borderColor="red.200"
                      bg="red.50"
                      borderRadius="lg"
                      px={4}
                      py={3}
                    >
                      <Text color="red.700" fontSize="sm">
                        {error}
                      </Text>
                    </Box>
                  ) : null}

                  <Button
                    type="submit"
                    colorScheme="green"
                    bg="brand.600"
                    _hover={{ bg: 'brand.700' }}
                    isLoading={isSubmitting}
                    loadingText="Creating"
                  >
                    Create account
                  </Button>

                  <HStack>
                    <Divider />
                    <Text fontSize="sm" color="blackAlpha.600" whiteSpace="nowrap">
                      Already have an account?
                    </Text>
                    <Divider />
                  </HStack>

                  <Text color="blackAlpha.700">
                    Sign in{' '}
                    <Link as={NextLink} href="/login" color="brand.600" fontWeight="600">
                      Login
                    </Link>
                  </Text>
                </Stack>
              </Box>
            </VStack>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
