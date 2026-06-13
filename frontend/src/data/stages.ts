export enum StageKey {
  Character = 'character',
  Action = 'action',
  Topic = 'topic',
  Style = 'style',
}

export type Stage = {
  key: StageKey
  title: string
  subtitle: string
  options: string[]
}

export type SelectedState = Record<StageKey, string>

export const stages: Stage[] = [
  {
    key: StageKey.Character,
    title: 'Hero',
    subtitle: 'Pick a hero',
    options: ['Brave astronaut', 'Friendly dragon', 'Curious detective', 'Magic unicorn'],
  },
  {
    key: StageKey.Action,
    title: 'Action',
    subtitle: 'Pick what to do',
    options: ['Find a hidden treasure', 'Solve a secret mystery', 'Help a friend', 'Explore a new planet'],
  },
  {
    key: StageKey.Topic,
    title: 'World',
    subtitle: 'Pick a place',
    options: ['Space school', 'Jungle world', 'Fantasy kingdom', 'Science fair'],
  },
  {
    key: StageKey.Style,
    title: 'Style',
    subtitle: 'Pick a look',
    options: ['Sparkly', 'Brave and bold', 'Silly and funny', 'Peaceful and kind'],
  },
]

export const optionEmojis: Record<StageKey, string[]> = {
  [StageKey.Character]: ['🚀', '🐉', '🕵️', '🦄'],
  [StageKey.Action]: ['🗺️', '🕵️‍♂️', '🤝', '🪐'],
  [StageKey.Topic]: ['🏫', '🌴', '🏰', '🔬'],
  [StageKey.Style]: ['✨', '🦸', '🤪', '💖'],
}

export const storyTemplates: Array<(selected: SelectedState) => string> = [
  ({ character, action, topic, style }) =>
    `Once upon a time in ${topic}, a ${style} ${character} decided to ${action}. It was a magical adventure!`,
  ({ character, action, topic, style }) =>
    `In ${topic}, a ${style} ${character} got ready to ${action}. It felt like a fun surprise!`,
  ({ character, action, topic, style }) =>
    `A ${style} ${character} woke up in ${topic} and wanted to ${action}. Everyone smiled!`,
]

export type StageCardItem = {
  key: StageKey
  label: string
  icon: string
  value: string
  unlocked: boolean
  active: boolean
}

export const getStageLabel = (stage: number) => {
  switch (stage) {
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

export const buildStageCards = (selected: SelectedState, currentStage: number): StageCardItem[] => {
  return [
    {
      key: StageKey.Character,
      label: 'WHO',
      icon: '🧙',
      value: selected.character || 'a hero',
      unlocked: true,
      active: currentStage === 0,
    },
    {
      key: StageKey.Action,
      label: 'DOES WHAT',
      icon: '🎯',
      value: selected.action || 'an action',
      unlocked: Boolean(selected.character),
      active: currentStage === 1,
    },
    {
      key: StageKey.Topic,
      label: 'WHERE',
      icon: '🌌',
      value: selected.topic || 'a world',
      unlocked: Boolean(selected.action),
      active: currentStage === 2,
    },
    {
      key: StageKey.Style,
      label: 'HOW',
      icon: '✨',
      value: selected.style || 'a style',
      unlocked: Boolean(selected.topic),
      active: currentStage === 3,
    },
  ]
}
