'use client'

import NextLink from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Badge,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { ApiError, fetchJson } from '../../lib/fetchJson'

type Assessment = {
  id: string
  title: string
  description?: string
  revealThreshold: number
  techStack?: string[]
  mentorStrictness?: number
}

type CreateAssessmentResponse = { assessment: Assessment }

export default function CreateAssessmentPage() {
  const router = useRouter()

  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [revealThreshold, setRevealThreshold] = React.useState('70')

  const [techStack, setTechStack] = React.useState<string[]>(['TypeScript'])
  const [mentorStrictness, setMentorStrictness] = React.useState(5)

  const [taskTitle, setTaskTitle] = React.useState('Two Sum')
  const [taskPrompt, setTaskPrompt] = React.useState(
    'Given an array of integers, return indices of the two numbers such that they add up to a specific target.'
  )
  const [exampleInput, setExampleInput] = React.useState('nums = [2,7,11,15], target = 9')
  const [exampleOutput, setExampleOutput] = React.useState('[0,1]')

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <Box minH="100dvh" bg="var(--background)" color="var(--foreground)">
      <Container maxW="5xl" py={{ base: 10, md: 14 }}>
        <HStack justify="space-between" align="start" spacing={6} flexWrap="wrap">
          <Box>
            <Link as={NextLink} href="/dashboard" color="brand.600" fontWeight={600}>
              ← Back to dashboard
            </Link>
            <Heading mt={3} fontFamily="var(--font-playfair)" fontSize={{ base: '3xl', md: '4xl' }}>
              Assessment Builder
            </Heading>
            <Text mt={2} color="blackAlpha.700" maxW="80ch">
              Configure the job test: tech stack, challenge prompt, mentor strictness, and the passing Merit Score threshold.
            </Text>
          </Box>

          <Badge bg="brand.100" color="brand.700" px={3} py={1} borderRadius="full" fontSize="xs">
            /assessments/create
          </Badge>
        </HStack>

        <Divider my={8} borderColor="blackAlpha.200" />

        <Box bg="white" borderRadius="2xl" borderWidth="1px" borderColor="blackAlpha.100" p={{ base: 6, md: 8 }}>
          <VStack align="stretch" spacing={6}>
            {error ? (
              <Box borderWidth="1px" borderColor="red.200" bg="red.50" borderRadius="lg" px={4} py={3}>
                <Text color="red.700" fontSize="sm">
                  {error}
                </Text>
              </Box>
            ) : null}

            <Stack
              as="form"
              spacing={5}
              onSubmit={async (e) => {
                e.preventDefault()
                setIsSubmitting(true)
                setError(null)

                try {
                  const payload = {
                    title,
                    description,
                    revealThreshold: Number.isFinite(Number(revealThreshold)) ? Number(revealThreshold) : 70,
                    techStack,
                    mentorStrictness,
                    tasks: [
                      {
                        title: taskTitle,
                        prompt: taskPrompt,
                        exampleInput,
                        exampleOutput,
                        difficulty: 'easy',
                        tags: ['arrays', 'hashmap'],
                      },
                    ],
                  }

                  const res = await fetchJson<CreateAssessmentResponse>('/api/assessments', {
                    method: 'POST',
                    body: payload,
                  })

                  router.push(`/assessments/${res.assessment.id}`)
                } catch (err) {
                  setError(err instanceof ApiError ? err.message : 'Failed to create assessment')
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              <FormControl isRequired>
                <FormLabel>Assessment title</FormLabel>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Backend Engineer — Arrays" />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this role is screening for" />
              </FormControl>

              <FormControl>
                <FormLabel>Passing Merit Score threshold (0–100)</FormLabel>
                <Input value={revealThreshold} onChange={(e) => setRevealThreshold(e.target.value)} inputMode="numeric" />
              </FormControl>

              <Divider />

              <FormControl>
                <FormLabel>Tech stack</FormLabel>
                <CheckboxGroup value={techStack} onChange={(v) => setTechStack(v as string[])}>
                  <HStack spacing={4} flexWrap="wrap">
                    <Checkbox value="JavaScript">JavaScript</Checkbox>
                    <Checkbox value="TypeScript">TypeScript</Checkbox>
                    <Checkbox value="Python">Python</Checkbox>
                    <Checkbox value="Java">Java</Checkbox>
                  </HStack>
                </CheckboxGroup>
              </FormControl>

              <FormControl>
                <FormLabel>AI Mentor strictness</FormLabel>
                <Text color="blackAlpha.700" fontSize="sm" mb={2}>
                  {mentorStrictness}/10 — higher means fewer/shorter hints.
                </Text>
                <Slider value={mentorStrictness} min={0} max={10} step={1} onChange={setMentorStrictness}>
                  <SliderTrack>
                    <SliderFilledTrack bg="brand.600" />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </FormControl>

              <Divider />

              <Box>
                <Heading as="h2" fontSize="xl">
                  Coding challenge
                </Heading>
                <Text mt={1} color="blackAlpha.700">
                  This is what candidates will work on.
                </Text>
              </Box>

              <FormControl isRequired>
                <FormLabel>Challenge title</FormLabel>
                <Input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Challenge prompt</FormLabel>
                <Textarea value={taskPrompt} onChange={(e) => setTaskPrompt(e.target.value)} minH="160px" />
              </FormControl>

              <FormControl>
                <FormLabel>Example input</FormLabel>
                <Textarea value={exampleInput} onChange={(e) => setExampleInput(e.target.value)} minH="80px" />
              </FormControl>

              <FormControl>
                <FormLabel>Example output</FormLabel>
                <Textarea value={exampleOutput} onChange={(e) => setExampleOutput(e.target.value)} minH="80px" />
              </FormControl>

              <Button type="submit" isLoading={isSubmitting} loadingText="Creating" colorScheme="green" bg="brand.600" _hover={{ bg: 'brand.700' }}>
                Create assessment
              </Button>
            </Stack>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
