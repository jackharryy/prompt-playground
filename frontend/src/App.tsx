import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useSpeech } from './hooks/useSpeech'
import { categories, buildStepCards, getStepLabel, SelectedState, storyTemplates, type CategoryKey, optionEmojis } from './data/story'
import { generateStageOptions } from './ai/stageGenerator'
import { generateEmojisForOptions } from './ai/emojiGenerator'
import { SpellHeader } from './components/SpellHeader'
import { StepCards } from './components/StepCards'
import { OptionGrid } from './components/OptionGrid'
import { SpellPreview } from './components/SpellPreview'
import { AiConsole } from './components/AiConsole'
import Account from './components/Account'
import { getMe } from './api/auth'

const defaultStageOptions = categories.reduce((acc, category) => {
  acc[category.key] = category.options
  return acc
}, {} as Record<CategoryKey, string[]>)

const defaultStageEmojis = categories.reduce((acc, category) => {
  acc[category.key] = optionEmojis[category.key] || category.options.map(() => '⭐')
  return acc
}, {} as Record<CategoryKey, string[]>)

const initialGeneratedState: Record<CategoryKey, boolean> = {
  character: false,
  action: false,
  topic: false,
  style: false,
}

const App = () => {
  const [me, setMe] = useState<{ authenticated: boolean; email?: string; name?: string } | null>(null)

  useEffect(() => {
    let mounted = true
    getMe().then((d) => { if (mounted) setMe(d) })
    return () => { mounted = false }
  }, [])

  if (me && !me.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4">
          <Account />
        </div>
      </div>
    )
  }
  const [currentStep, setCurrentStep] = useState(0)
  const [selected, setSelected] = useState<SelectedState>({
    character: '',
    action: '',
    topic: '',
    style: '',
  })
  const [stageOptions, setStageOptions] = useState<Record<CategoryKey, string[]>>(defaultStageOptions)
  const [stageEmojis, setStageEmojis] = useState<Record<CategoryKey, string[]>>(defaultStageEmojis)
  const [generatedStages, setGeneratedStages] = useState<Record<CategoryKey, boolean>>(initialGeneratedState)
  const [loadingStages, setLoadingStages] = useState<Record<CategoryKey, boolean>>({
    character: false,
    action: false,
    topic: false,
    style: false,
  })
  const [optionError, setOptionError] = useState<string | null>(null)

  const currentCategory = categories[currentStep]
  const isSelected = Boolean(selected[currentCategory.key])

  const currentCategoryWithOptions = {
    ...currentCategory,
    options: stageOptions[currentCategory.key] || currentCategory.options,
  }

  const story = useMemo(() => {
    const filled = categories.every((category) => selected[category.key])
    if (!filled) {
      return 'Pick one block for each card. Then listen or make a new hero.'
    }

    const index = (selected.character.length + selected.action.length + selected.topic.length + selected.style.length) % storyTemplates.length
    return storyTemplates[index](selected)
  }, [selected])

  const systemPrompt = useMemo(() => {
    return (
      `You are a friendly AI hero created by a child ages 5 to 8. You will be talking directly to the child who built you, and you should take on the persona of the configured hero.

` +
      `Hero description: ${story}

` +
      'Respond in simple, cheerful language that feels safe, playful, and easy to understand. Act like a brave, kind hero who wants to help the child and make the story come alive.'
    )
  }, [story])

  const fetchStageOptions = async (stage: CategoryKey) => {
    setOptionError(null)
    setLoadingStages((prev) => ({ ...prev, [stage]: true }))
    try {
      const options = await generateStageOptions(stage, selected)
      setStageOptions((prev) => ({ ...prev, [stage]: options }))
      // generate matching emojis
      try {
        const emojis = await generateEmojisForOptions(options)
        setStageEmojis((prev) => ({ ...prev, [stage]: emojis }))
      } catch {
        // keep defaults
      }
      setGeneratedStages((prev) => ({ ...prev, [stage]: true }))
    } catch (error) {
      setOptionError('Sorry, I could not generate choices right now. Please try again.')
    } finally {
      setLoadingStages((prev) => ({ ...prev, [stage]: false }))
    }
  }

  useEffect(() => {
    if (!generatedStages.character && !loadingStages.character) {
      fetchStageOptions('character')
    }
  }, [generatedStages.character, loadingStages.character])

  useEffect(() => {
    if (selected.character && !generatedStages.action && !loadingStages.action) {
      fetchStageOptions('action')
    }
  }, [selected.character, generatedStages.action, loadingStages.action])

  useEffect(() => {
    if (selected.action && !generatedStages.topic && !loadingStages.topic) {
      fetchStageOptions('topic')
    }
  }, [selected.action, generatedStages.topic, loadingStages.topic])

  useEffect(() => {
    if (selected.topic && !generatedStages.style && !loadingStages.style) {
      fetchStageOptions('style')
    }
  }, [selected.topic, generatedStages.style, loadingStages.style])

  const clearLaterStages = (stage: CategoryKey) => {
    setStageOptions((prev) => ({
      ...prev,
      ...(stage === 'character' ? { action: defaultStageOptions.action, topic: defaultStageOptions.topic, style: defaultStageOptions.style } : {}),
      ...(stage === 'action' ? { topic: defaultStageOptions.topic, style: defaultStageOptions.style } : {}),
      ...(stage === 'topic' ? { style: defaultStageOptions.style } : {}),
    }))
    setGeneratedStages((prev) => ({
      ...prev,
      ...(stage === 'character' ? { action: false, topic: false, style: false } : {}),
      ...(stage === 'action' ? { topic: false, style: false } : {}),
      ...(stage === 'topic' ? { style: false } : {}),
    }))
    setStageEmojis((prev) => ({
      ...prev,
      ...(stage === 'character' ? { action: defaultStageEmojis.action, topic: defaultStageEmojis.topic, style: defaultStageEmojis.style } : {}),
      ...(stage === 'action' ? { topic: defaultStageEmojis.topic, style: defaultStageEmojis.style } : {}),
      ...(stage === 'topic' ? { style: defaultStageEmojis.style } : {}),
    }))
  }

  const handleSelect = (key: keyof SelectedState, item: string) => {
    setSelected((prev) => {
      const result = { ...prev, [key]: item }
      if (key === 'character') {
        result.action = ''
        result.topic = ''
        result.style = ''
      } else if (key === 'action') {
        result.topic = ''
        result.style = ''
      } else if (key === 'topic') {
        result.style = ''
      }
      return result
    })
    clearLaterStages(key)
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
    setSelected({ character: '', action: '', topic: '', style: '' })
    setCurrentStep(0)
    setGeneratedStages(initialGeneratedState)
    setOptionError(null)
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

          <OptionGrid
            category={currentCategoryWithOptions}
            selected={selected}
            onSelect={handleSelect}
            currentStep={currentStep}
            loading={loadingStages[currentCategory.key]}
            error={optionError}
            emojis={stageEmojis[currentCategory.key]}
          />
        </motion.div>

        <SpellPreview story={story} visible={currentStep === categories.length - 1} />

        {currentStep === categories.length - 1 && (
          <div>
            <AiConsole systemPrompt={systemPrompt} />
          </div>
        )}

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
              {ttsState === 'speaking' ? 'Listening...' : 'Hear hero'}
            </button>
          )}
          <button
            onClick={currentStep === categories.length - 1 ? handleCast : handleNext}
            disabled={!isSelected}
            className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
          >
            {currentStep === categories.length - 1 ? 'New hero' : 'Next'}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default App
