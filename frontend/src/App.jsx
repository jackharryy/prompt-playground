import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'

const categories = [
  {
    key: 'character',
    title: 'Hero',
    subtitle: 'Pick a hero',
    options: ['Brave astronaut', 'Friendly dragon', 'Curious detective', 'Magic unicorn'],
  },
  {
    key: 'action',
    title: 'Action',
    subtitle: 'Pick what to do',
    options: ['find a hidden treasure', 'solve a secret mystery', 'help a friend', 'explore a new planet'],
  },
  {
    key: 'topic',
    title: 'World',
    subtitle: 'Pick a place',
    options: ['space school', 'jungle world', 'fantasy kingdom', 'science fair'],
  },
  {
    key: 'style',
    title: 'Style',
    subtitle: 'Pick a look',
    options: ['sparkly', 'brave and bold', 'silly and funny', 'peaceful and kind'],
  },
]

const categoryColors = {
  character: ['#f9a8d4', '#a78bfa'],
  action: ['#fb923c', '#f97316'],
  topic: ['#38bdf8', '#0ea5e9'],
  style: ['#86efac', '#4ade80'],
}

const categoryIcons = {
  character: '🧚',
  action: '🎯',
  topic: '🌎',
  style: '✨',
}

const optionEmojis = {
  character: ['🚀', '🐉', '🕵️', '🦄'],
  action: ['🗺️', '🕵️‍♂️', '🤝', '🪐'],
  topic: ['🏫', '🌴', '🏰', '🔬'],
  style: ['✨', '🦸', '🤪', '💖'],
}

const storyTemplates = [
  ({ character, action, topic, style }) =>
    `Once upon a time in ${topic}, a ${style} ${character} decided to ${action}. It was a magical adventure!`,
  ({ character, action, topic, style }) =>
    `In ${topic}, a ${style} ${character} got ready to ${action}. It felt like a fun surprise!`,
  ({ character, action, topic, style }) =>
    `A ${style} ${character} woke up in ${topic} and wanted to ${action}. Everyone smiled!`,
]

const App = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selected, setSelected] = useState({
    character: '',
    action: '',
    topic: '',
    style: '',
  })
  const [regenerateSeed, setRegenerateSeed] = useState(0)
  const [ttsState, setTtsState] = useState('ready')

  const currentCategory = categories[currentStep]
  const isSelected = Boolean(selected[currentCategory.key])

  const story = useMemo(() => {
    const filled = categories.every((category) => selected[category.key])
    if (!filled) {
      return 'Pick one block for each card. Then listen or make a new story.'
    }
    const template = storyTemplates[regenerateSeed % storyTemplates.length]
    return template(selected)
  }, [selected, regenerateSeed])

  const handleSelect = (key, item) => {
    setSelected((prev) => ({ ...prev, [key]: item }))
  }

  const handleNext = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep((step) => step + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1)
    }
  }

  const handleRegenerate = () => {
    setRegenerateSeed((seed) => seed + 1)
  }

  const handleListen = () => {
    if (!window.speechSynthesis) return
    const availableVoices = window.speechSynthesis.getVoices();
    // Find a specific voice (e.g., Google US English)
    const selectedVoice = availableVoices.find(voice => voice.name === "Google US English");
    if (selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(story)
      utterance.rate = 1
      utterance.pitch = 1.1
      utterance.voice = selectedVoice;
      setTtsState('speaking')
      utterance.onend = () => setTtsState('ready')
      speechSynthesis.cancel()
      speechSynthesis.speak(utterance)
      }
  }

  return (
    <Box minH="100vh" px={{ base: 4, md: 6 }} py={6} bg="yellow">
      <Container maxW="7xl">
        <Stack spacing={6}>
          <Box rounded="md" bg="white" p={{ base: 5, md: 8 }} border="1px solid" borderColor="black">
            <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" gap={4}>
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="blue" letterSpacing="widest">
                  STORY LAB
                </Text>
                <Heading size="2xl" mt={2} color="black">
                  Build a story!
                </Heading>
              </Box>
              <Box rounded="md" bg="yellow" px={6} py={4} color="black" textAlign="center" border="1px solid" borderColor="black">
                <Text fontSize="xs" fontWeight="bold" letterSpacing="widest">
                  STEP
                </Text>
                <Text fontSize="3xl" fontWeight="extrabold">
                  {currentStep + 1} / {categories.length}
                </Text>
              </Box>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mt={6}>
              {['Pick', 'Next', 'Listen'].map((label) => (
                <Box key={label} rounded="md" bg="yellow" p={4} textAlign="center" border="1px solid" borderColor="black">
                  <Text fontSize="md" fontWeight="bold" color="black">
                    {label}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          <Stack spacing={6} rounded="md" bg="white" p={{ base: 5, md: 8 }} border="1px solid" borderColor="black">
            <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="red" letterSpacing="widest">
                  {categoryIcons[currentCategory.key]} {currentCategory.title}
                </Text>
                <Heading size="xl" mt={2} color="black">
                  {currentCategory.subtitle}
                </Heading>
              </Box>
            </Flex>

            <Box rounded="md" bg="yellow" p={5} border="1px solid" borderColor="black">
              <Text fontSize="sm" color="black">
                Tap a block, then tap Next.
              </Text>
            </Box>
          </Stack>

          <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={6}>
            <Stack spacing={6} rounded="md" bg="white" p={{ base: 5, md: 8 }} border="1px solid" borderColor="black">
              <Text fontSize="sm" fontWeight="semibold" color="blue" letterSpacing="widest">
                Choose your block
              </Text>
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                {currentCategory.options.map((option, index) => {
                  const active = selected[currentCategory.key] === option
                  const emoji = optionEmojis[currentCategory.key]?.[index] || '⭐'
                  return (
                            <Button
                      key={option}
                      onClick={() => handleSelect(currentCategory.key, option)}
                      h="auto"
                      p={6}
                      textAlign="left"
                      borderRadius="md"
                      bg={active ? 'orange' : 'white'}
                      color={active ? 'white' : 'black'}
                      border="1px solid"
                      borderColor={active ? 'black' : 'black'}
                      _hover={{ transform: 'translateY(-2px)', bg: active ? 'orange' : 'yellow' }}
                    >
                      <Flex align="center" gap={4}>
                        <Text fontSize="4xl">{emoji}</Text>
                        <Box>
                          <Text fontSize="lg" fontWeight="bold">
                            {option}
                          </Text>
                          <Text fontSize="sm" color={active ? 'whiteAlpha.800' : 'gray.500'}>
                            Tap to choose
                          </Text>
                        </Box>
                      </Flex>
                    </Button>
                  )
                })}
              </SimpleGrid>

              <Stack spacing={4} rounded="md" bg="white" p={5} border="1px solid" borderColor="black">
                <Text fontSize="sm" fontWeight="bold" color="black">
                  Navigation
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  <Button
                    onClick={handleBack}
                    isDisabled={currentStep === 0}
                    borderRadius="md"
                    variant="outline"
                    borderColor="black"
                    color="black"
                  >
                    ◀️ Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    isDisabled={!isSelected}
                    borderRadius="md"
                    bg="orange"
                    color="white"
                    _hover={{ opacity: 0.9 }}
                  >
                    {currentStep === categories.length - 1 ? 'Finish' : 'Next'} ▶️
                  </Button>
                </SimpleGrid>
                <Text fontSize="sm" color="black">
                  Choose first, then tap Next.
                </Text>
              </Stack>

              <Flex wrap="wrap" gap={3}>
                {categories.map((category) => (
                  <Box
                    key={category.key}
                    rounded="md"
                    bg="yellow"
                    px={4}
                    py={2}
                    fontSize="sm"
                    fontWeight="semibold"
                    color="black"
                    border="1px solid"
                    borderColor="black"
                  >
                    {category.title}: {selected[category.key] || 'Pick one'}
                  </Box>
                ))}
              </Flex>
            </Stack>

            <Stack spacing={6} rounded="md" bg="whiteAlpha.900" p={{ base: 5, md: 8 }} border="1px solid" borderColor="black">
              <Box rounded="md" bg="green" p={5} color="black" border="1px solid" borderColor="black">
                <Text fontSize="sm" fontWeight="bold" letterSpacing="widest">
                  My picks
                </Text>
                <Stack spacing={3} mt={4}>
                  {categories.map((category) => (
                    <Box key={category.key} rounded="md" bg="white" p={3} border="1px solid" borderColor="black">
                      <Text fontSize="xs" letterSpacing="widest" color="black">
                        {category.title}
                      </Text>
                      <Text fontSize="sm" fontWeight="bold" color="black">
                        {selected[category.key] || 'Pick one'}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>

          <Box rounded="md" bg="yellow" p={{ base: 5, md: 8 }} border="1px solid" borderColor="black">
            <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
              <Text fontSize="sm" fontWeight="bold" letterSpacing="widest" color="blue">
                Story
              </Text>
              <Box rounded="md" bg="white" px={3} py={1} fontSize="xs" fontWeight="bold" color="black" border="1px solid" borderColor="black">
                Read aloud
              </Box>
            </Flex>
            <Box rounded="md" bg="white" p={6} mt={4} border="1px solid" borderColor="black">
              <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="tall" color="black">
                {story}
              </Text>
            </Box>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3} mt={6}>
              <Button
                onClick={handleListen}
                borderRadius="md"
                bg="orange"
                color="white"
                _hover={{ opacity: 0.9 }}
              >
                {ttsState === 'speaking' ? 'Speaking...' : 'Listen'}
              </Button>
              <Button
                onClick={handleRegenerate}
                borderRadius="md"
                border="1px solid"
                borderColor="black"
                color="black"
                bg="orange"
                _hover={{ bg: 'yellow' }}
              >
                New story
              </Button>
            </SimpleGrid>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
