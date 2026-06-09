import { useMemo, useState } from 'react'
import { useSpeech } from './hooks/useSpeech'
import { categories, buildStepCards, getStepLabel, SelectedState, storyTemplates } from './data/story'
import { SpellHeader } from './components/SpellHeader'
import { StepCards } from './components/StepCards'
import { OptionGrid } from './components/OptionGrid'
import { SpellPreview } from './components/SpellPreview'
import { AiConsole } from './components/AiConsole'

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
    <div className="min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <SpellHeader />
        <StepCards cards={stepCards} />

        <div className="bg-gray-900 border-2 border-gray-700 rounded-3xl p-5 md:p-6">
          <p className="text-xs font-bold text-yellow-300 tracking-widest">
            {currentStepLabel}
          </p>
          <p className="text-lg mt-3 text-white">
            {currentCategory.subtitle}
          </p>

          <OptionGrid category={currentCategory} selected={selected} onSelect={handleSelect} />
        </div>

        <SpellPreview story={story} visible={currentStep === categories.length - 1} />

        {currentStep === categories.length - 1 && (
          <div>
            <AiConsole systemPrompt={story} />
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
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
            className="flex-1 px-6 py-3 rounded-2xl bg-orange-300 text-black border-2 border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-400"
          >
            {currentStep === categories.length - 1 ? 'New spell' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
