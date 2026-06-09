import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div 
      className="min-h-screen py-8 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="max-w-5xl mx-auto space-y-6">
        <SpellHeader />
        <StepCards cards={stepCards} />

        <motion.div 
          className=""
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-bold text-blue-300 tracking-widest uppercase">
            {currentStepLabel}
          </p>
          {/* <p className="text-lg mt-3 text-white">
            {currentCategory.subtitle}
          </p> */}

          <OptionGrid category={currentCategory} selected={selected} onSelect={handleSelect} currentStep={currentStep} />
        </motion.div>

        <SpellPreview story={story} visible={currentStep === categories.length - 1} />

        <motion.div 
          className="flex gap-3 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-2xl bg-gray-800 text-white border-2 border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            Back
          </button>
          {currentStep === categories.length - 1 && (
            <button
              onClick={handleListen}
              disabled={!isSelected}
              className="px-6 py-3 rounded-2xl bg-gray-800 text-white border-2 border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              {ttsState === 'speaking' ? 'Listening...' : 'Hear spell'}
            </button>
          )}
          <button
            onClick={currentStep === categories.length - 1 ? handleCast : handleNext}
            disabled={!isSelected}
            className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            {currentStep === categories.length - 1 ? 'New spell' : 'Next'}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default App
