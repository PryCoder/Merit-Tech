'use client'

import NextLink from 'next/link'
import React from 'react'
import { fetchJson, ApiError } from '../../lib/fetchJson'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)" display="flex">
      <Container maxW="lg" py={{ base: 10, md: 16 }}>
        <Box
          borderWidth="1px"
          borderColor="blackAlpha.100"
          borderRadius="2xl"
          bg="white"
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 10 }}
        >
          <VStack align="stretch" spacing={6}>
            <Box>
              <Text
                fontFamily="var(--font-space-grotesk)"
                fontWeight="600"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color="blackAlpha.700"
                fontSize="sm"
              >
                Account recovery
              </Text>
              <Heading as="h1" fontFamily="var(--font-playfair)" fontSize={{ base: '3xl', md: '4xl' }}>
                Reset your password
              </Heading>
              <Text color="blackAlpha.700" mt={2}>
                We’ll email you a secure link to set a new password.
              </Text>
            </Box>

            <Box
              as="form"
              onSubmit={async (e: React.FormEvent) => {
                e.preventDefault()
                setIsSubmitting(true)
                setMessage(null)

                try {
                  await fetchJson('/api/auth/forgot-password', {
                    method: 'POST',
                    body: { email },
                  })
                  setMessage('If an account exists, a reset link will be sent.')
                } catch (err) {
                  if (err instanceof ApiError) {
                    setMessage(err.message)
                  } else {
                    setMessage('Something went wrong. Please try again.')
                  }
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              <Stack spacing={4}>
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
                  <FormHelperText color="blackAlpha.600">
                    If you don’t see the email, check spam.
                  </FormHelperText>
                </FormControl>

                {message ? (
                  <Box
                    borderWidth="1px"
                    borderColor="blackAlpha.200"
                    bg="blackAlpha.50"
                    borderRadius="lg"
                    px={4}
                    py={3}
                  >
                    <Text fontSize="sm" color="blackAlpha.700">
                      {message}
                    </Text>
                  </Box>
                ) : null}

                <Button
                  type="submit"
                  colorScheme="green"
                  bg="brand.600"
                  _hover={{ bg: 'brand.700' }}
                  isLoading={isSubmitting}
                  loadingText="Sending"
                >
                  Send reset link
                </Button>

                <HStack justify="space-between" pt={2}>
                  <Link as={NextLink} href="/login" color="brand.600" fontWeight="600">
                    Back to login
                  </Link>
                  <Text fontFamily="var(--font-geist-mono)" fontSize="xs" color="blackAlpha.600">
                    Encrypted delivery
                  </Text>
                </HStack>
              </Stack>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
