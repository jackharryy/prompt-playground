export type CategoryKey = 'character' | 'action' | 'topic' | 'style'

export type Category = {
  key: CategoryKey
  title: string
  subtitle: string
  options: string[]
}

export type SelectedState = Record<CategoryKey, string>

export const categories: Category[] = [
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

export const optionEmojis: Record<CategoryKey, string[]> = {
  character: ['🚀', '🐉', '🕵️', '🦄'],
  action: ['🗺️', '🕵️‍♂️', '🤝', '🪐'],
  topic: ['🏫', '🌴', '🏰', '🔬'],
  style: ['✨', '🦸', '🤪', '💖'],
}

export const storyTemplates: Array<(selected: SelectedState) => string> = [
  ({ character, action, topic, style }) =>
    `Once upon a time in ${topic}, a ${style} ${character} decided to ${action}. It was a magical adventure!`,
  ({ character, action, topic, style }) =>
    `In ${topic}, a ${style} ${character} got ready to ${action}. It felt like a fun surprise!`,
  ({ character, action, topic, style }) =>
    `A ${style} ${character} woke up in ${topic} and wanted to ${action}. Everyone smiled!`,
]

export type StepCardItem = {
  key: CategoryKey
  label: string
  icon: string
  value: string
  unlocked: boolean
  active: boolean
}

export const getStepLabel = (step: number) => {
  switch (step) {
    case 0:
      return 'Choose your hero'
    case 1:
      return 'Choose the action'
    case 2:
      return 'Choose the world'
    default:
      return 'Choose the style'
  }
}

export const buildStepCards = (selected: SelectedState, currentStep: number): StepCardItem[] => {
  return [
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
}
