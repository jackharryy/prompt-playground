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

  const handleCast = () => {
    setRegenerateSeed((seed) => seed + 1)
  }

  const handleListen = () => {
    if (!window.speechSynthesis) return
    const utterance = new SpeechSynthesisUtterance(story)
    utterance.rate = 1
    utterance.pitch = 1.1
    setTtsState('speaking')
    utterance.onend = () => setTtsState('ready')
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }

  const stepCards = [
    {
      key: 'character',
      label: 'WHO',
      icon: '🧙',
      value: selected.character || 'a hero',
      unlocked: true,
      active: currentStep === 0,
    },
    {
      key: 'action',
      label: 'DOES WHAT',
      icon: '🎯',
      value: selected.action || 'an action',
      unlocked: Boolean(selected.character),
      active: currentStep === 1,
    },
    {
      key: 'topic',
      label: 'WHERE',
      icon: '🌌',
      value: selected.topic || 'a world',
      unlocked: Boolean(selected.action),
      active: currentStep === 2,
    },
    {
      key: 'style',
      label: 'HOW',
      icon: '✨',
      value: selected.style || 'a style',
      unlocked: Boolean(selected.topic),
      active: currentStep === 3,
    },
  ]

  const currentStepLabel =
    currentStep === 0
      ? 'Choose your hero'
      : currentStep === 1
      ? 'Choose the action'
      : currentStep === 2
      ? 'Choose the world'
      : 'Choose the style'

  return (
    <Box minH="100vh" bg="gray.950" py={8} px={{ base: 4, md: 6 }}>
      <Container maxW="5xl">
        <Stack spacing={6}>
          <Box bg="gray.900" border="2px solid" borderColor="gray.700" rounded="3xl" p={{ base: 5, md: 8 }}>
            <Text fontSize="xs" fontWeight="bold" color="yellow.300" letterSpacing="widest">
              SPELL CRAFTER
            </Text>
            <Heading size="2xl" mt={3} color="white">
              Build a simple spell
            </Heading>
            <Text fontSize="sm" mt={2} color="gray.400">
              Tap the current step, choose one option, then cast the spell.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
            {stepCards.map((card) => (
              <Box
                key={card.key}
                bg={card.active ? 'orange.300' : card.unlocked ? 'gray.800' : 'gray.700'}
                color={card.active ? 'black' : 'white'}
                border="2px solid"
                borderColor={card.active ? 'orange.300' : 'gray.600'}
                rounded="3xl"
                p={5}
                textAlign="center"
              >
                <Text fontSize="3xl">{card.icon}</Text>
                <Text fontSize="xs" fontWeight="bold" letterSpacing="widest" mt={3}>
                  {card.label}
                </Text>
                <Text fontSize="sm" mt={2} fontWeight="bold">
                  {card.value}
                </Text>
                {!card.unlocked && (
                  <Text fontSize="xs" mt={2} color="gray.400">
                    locked
                  </Text>
                )}
              </Box>
            ))}
          </SimpleGrid>

          <Box bg="gray.900" border="2px solid" borderColor="gray.700" rounded="3xl" p={{ base: 5, md: 6 }}>
            <Text fontSize="xs" fontWeight="bold" color="yellow.300" letterSpacing="widest">
              {currentStepLabel}
            </Text>
            <Text fontSize="lg" mt={3} color="white">
              {currentCategory.subtitle}
            </Text>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3} mt={5}>
              {currentCategory.options.map((option, index) => {
                const active = selected[currentCategory.key] === option
                const emoji = optionEmojis[currentCategory.key]?.[index] || '⭐'
                return (
                  <Button
                    key={option}
                    onClick={() => handleSelect(currentCategory.key, option)}
                    h="auto"
                    p={5}
                    textAlign="left"
                    borderRadius="2xl"
                    bg={active ? 'orange.300' : 'gray.800'}
                    color={active ? 'black' : 'white'}
                    border="2px solid"
                    borderColor={active ? 'orange.300' : 'gray.700'}
                    _hover={{ bg: active ? 'orange.300' : 'gray.700' }}
                  >
                    <Flex align="center" gap={4}>
                      <Text fontSize="3xl">{emoji}</Text>
                      <Box>
                        <Text fontSize="md" fontWeight="bold">
                          {option}
                        </Text>
                        <Text fontSize="xs" color={active ? 'black' : 'gray.300'}>
                          {active ? 'Selected' : 'Tap to choose'}
                        </Text>
                      </Box>
                    </Flex>
                  </Button>
                )
              })}
            </SimpleGrid>
          </Box>

          {currentStep === categories.length - 1 && (
            <Box bg="gray.800" border="2px solid" borderColor="gray.700" rounded="3xl" p={5}>
              <Text fontSize="xs" fontWeight="bold" color="yellow.300" letterSpacing="widest">
                SPELL READY
              </Text>
              <Text fontSize="sm" mt={3} color="white">
                {story}
              </Text>
            </Box>
          )}

          <Flex gap={3} flexWrap="wrap">
            <Button
              onClick={handleBack}
              isDisabled={currentStep === 0}
              borderRadius="2xl"
              bg="gray.800"
              color="white"
              border="2px solid"
              borderColor="gray.700"
            >
              Back
            </Button>
            {currentStep === categories.length - 1 && (
              <Button
                onClick={handleListen}
                isDisabled={!isSelected || ttsState === 'speaking'}
                borderRadius="2xl"
                bg="gray.800"
                color="white"
                border="2px solid"
                borderColor="gray.700"
              >
                {ttsState === 'speaking' ? 'Listening...' : 'Hear spell'}
              </Button>
            )}
            <Button
              onClick={currentStep === categories.length - 1 ? handleCast : handleNext}
              isDisabled={!isSelected}
              flex={1}
              borderRadius="2xl"
              bg="orange.300"
              color="black"
              border="2px solid"
              borderColor="orange.300"
            >
              {currentStep === categories.length - 1 ? 'Cast the spell' : 'Next'}
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
