import { useMemo, useState } from 'react'
import { Box, Button, Container, Flex, Stack, Text } from '@chakra-ui/react'
import { useSpeech } from './hooks/useSpeech'
import { categories, buildStepCards, getStepLabel, SelectedState, storyTemplates } from './data/story'
import { SpellHeader } from './components/SpellHeader'
import { StepCards } from './components/StepCards'
import { OptionGrid } from './components/OptionGrid'
import { SpellPreview } from './components/SpellPreview'

const App = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selected, setSelected] = useState<SelectedState>({
    character: '',
    action: '',
    topic: '',
    style: '',
  })
  const [regenerateSeed, setRegenerateSeed] = useState(0)

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

  const handleSelect = (key: keyof SelectedState, item: string) => {
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

  const { ttsState, speak } = useSpeech()

  const handleListen = () => {
    speak(story)
  }

  const stepCards = buildStepCards(selected, currentStep)
  const currentStepLabel = getStepLabel(currentStep)

  return (
    <Box minH="100vh" bg="gray.950" py={8} px={{ base: 4, md: 6 }}>
      <Container maxW="5xl">
        <Stack spacing={6}>
          <SpellHeader />
          <StepCards cards={stepCards} />

          <Box bg="gray.900" border="2px solid" borderColor="gray.700" rounded="3xl" p={{ base: 5, md: 6 }}>
            <Text fontSize="xs" fontWeight="bold" color="yellow.300" letterSpacing="widest">
              {currentStepLabel}
            </Text>
            <Text fontSize="lg" mt={3} color="white">
              {currentCategory.subtitle}
            </Text>

            <OptionGrid category={currentCategory} selected={selected} onSelect={handleSelect} />
          </Box>

          <SpellPreview story={story} visible={currentStep === categories.length - 1} />

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
                isDisabled={!isSelected}
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
              {currentStep === categories.length - 1 ? 'New spell' : 'Next'}
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
