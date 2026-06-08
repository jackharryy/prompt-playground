import { useMemo, useState } from 'react'

const categories = [
  {
    key: 'character',
    title: 'Character',
    subtitle: 'Choose your story hero',
    options: ['Brave astronaut', 'Friendly dragon', 'Curious detective', 'Magic unicorn'],
  },
  {
    key: 'action',
    title: 'What should they do?',
    subtitle: 'Pick the adventure action',
    options: ['find a hidden treasure', 'solve a secret mystery', 'help a friend', 'explore a new planet'],
  },
  {
    key: 'topic',
    title: 'Topic',
    subtitle: 'Choose the story theme',
    options: ['space school', 'jungle world', 'fantasy kingdom', 'science fair'],
  },
  {
    key: 'style',
    title: 'Character Style',
    subtitle: 'Make the character special',
    options: ['sparkly', 'brave and bold', 'silly and funny', 'peaceful and kind'],
  },
]

const categoryColors = {
  character: 'from-fuchsia-400 to-violet-500',
  action: 'from-amber-300 to-orange-500',
  topic: 'from-cyan-400 to-sky-600',
  style: 'from-lime-300 to-emerald-500',
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
    `Once upon a time in a ${topic}, a ${style} ${character} decided to ${action}. The friends cheered as the story became magical!`,
  ({ character, action, topic, style }) =>
    `In a colorful ${topic}, a ${style} ${character} could not wait to ${action}. Every step felt like a playful adventure.`,
  ({ character, action, topic, style }) =>
    `A ${style} ${character} woke up ready for a new day in ${topic}. Their goal was to ${action} and make everyone smile.`,
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
  const isSelected = selected[currentCategory.key]

  const story = useMemo(() => {
    const filled = categories.every((category) => selected[category.key])
    if (!filled) {
      return 'Pick a block in each category to build your story. Then listen or regenerate the final prompt.'
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
    const message = story
    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in this browser.')
      return
    }
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.rate = 1
    utterance.pitch = 1.1
    setTtsState('speaking')
    utterance.onend = () => setTtsState('ready')
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-slate-100 to-purple-100 px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-soft backdrop-blur-lg sm:p-10">
        <header className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">AI Scratch Builder</p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-900 sm:text-5xl">
                Make a story bot with fun blocks
              </h1>
            </div>
            <div className="rounded-3xl bg-slate-900 px-5 py-4 text-slate-50 shadow-lg shadow-slate-200/40">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Step</p>
              <p className="mt-1 text-3xl font-bold text-white">{currentStep + 1} / {categories.length}</p>
            </div>
          </div>
          <div className="rounded-[2rem] border border-sky-200 bg-gradient-to-r from-sky-100 via-slate-100 to-fuchsia-100 p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">How to play</p>
            <div className="mt-3 grid gap-2 text-slate-700 sm:grid-cols-3">
              <span className="rounded-3xl bg-white/80 px-4 py-3 text-sm font-medium shadow-sm">Pick one block for each stage</span>
              <span className="rounded-3xl bg-white/80 px-4 py-3 text-sm font-medium shadow-sm">Watch your story appear below</span>
              <span className="rounded-3xl bg-white/80 px-4 py-3 text-sm font-medium shadow-sm">Press listen or regenerate to play again</span>
            </div>
          </div>
        </header>

        <div className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="rounded-[2rem] bg-gradient-to-r from-fuchsia-400 via-sky-500 to-emerald-400 p-5 text-slate-950 shadow-lg shadow-fuchsia-300/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Stage</p>
              <p className="mt-3 text-3xl font-bold">{categoryIcons[currentCategory.key]} {currentCategory.title}</p>
              <p className="mt-2 text-sm text-white/90">{currentCategory.subtitle}</p>
            </div>
          </div>
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Instructions</p>
            <ul className="list-disc space-y-2 pl-5 text-slate-600">
              <li>Choose a fun block below.</li>
              <li>Then tap Next to build your story.</li>
              <li>Use Listen to hear it and Regenerate for a new version.</li>
            </ul>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">{currentCategory.title}</p>
              <h2 className="text-3xl font-semibold text-slate-900">{currentCategory.subtitle}</h2>
              <p className="text-slate-600">Pick one colorful block to add to your story robot.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {currentCategory.options.map((option, index) => {
                const active = selected[currentCategory.key] === option
                const emoji = optionEmojis[currentCategory.key]?.[index] || '⭐'
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(currentCategory.key, option)}
                    className={`rounded-[2rem] border px-5 py-6 text-left shadow-lg transition-all duration-200 ${active ? `border-transparent bg-gradient-to-r ${categoryColors[currentCategory.key]} text-white shadow-xl shadow-slate-400/20` : `border-slate-200 bg-white text-slate-800 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-100`}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{emoji}</span>
                      <div>
                        <p className="text-lg font-bold">{option}</p>
                        <p className="text-sm text-slate-500">Tap me!</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-gradient-to-r from-sky-200 via-cyan-100 to-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-sky-700">Ready to move?</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="rounded-3xl border border-slate-300 bg-white px-5 py-4 text-base font-semibold text-slate-900 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-100"
                >
                  ◀️ Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isSelected}
                  className="rounded-3xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-sky-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-fuchsia-300/20 transition disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-95"
                >
                  {currentStep === categories.length - 1 ? 'Finish' : 'Next'} ▶️
                </button>
              </div>
              <p className="text-sm text-slate-600">Use the buttons above after choosing a block. You can also change your choice anytime.</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {categories.map((category) => (
                <span
                  key={category.key}
                  className="rounded-full bg-gradient-to-r from-slate-100 via-white to-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                >
                  {category.title}: {selected[category.key] || 'Pick one'}
                </span>
              ))}
            </div>
          </div>

          <aside className="space-y-6 rounded-[2.5rem] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
            <div className="rounded-[2rem] bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 p-5 text-slate-950 shadow-lg shadow-amber-300/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Your story blocks</p>
              <div className="mt-4 space-y-2 text-slate-950">
                {categories.map((category) => (
                  <div key={category.key} className="rounded-3xl bg-white/90 p-3 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{category.title}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{selected[category.key] || 'Pick one'}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-cyan-100 via-slate-50 to-rose-100 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-700">Story preview</p>
          <p className="mt-4 text-base leading-7 text-slate-700">{story}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleListen}
              className="flex-1 rounded-3xl bg-gradient-to-r from-fuchsia-500 via-purple-600 to-sky-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-fuchsia-300/20 transition hover:opacity-95"
            >
              {ttsState === 'speaking' ? 'Speaking...' : 'Listen to story'}
            </button>
            <button
              type="button"
              onClick={handleRegenerate}
              className="flex-1 rounded-3xl border border-slate-300 bg-white px-5 py-4 text-base font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100"
            >
              Regenerate prompt
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
