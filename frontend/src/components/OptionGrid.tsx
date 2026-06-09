import type { Category, CategoryKey, SelectedState } from '../data/story'
import { optionEmojis } from '../data/story'

interface OptionGridProps {
  category: Category
  selected: SelectedState
  onSelect: (key: CategoryKey, item: string) => void
}

export const OptionGrid = ({ category, selected, onSelect }: OptionGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
    {category.options.map((option, index) => {
      const active = selected[category.key] === option
      const emoji = optionEmojis[category.key]?.[index] || '⭐'
      return (
        <button
          key={option}
          onClick={() => onSelect(category.key, option)}
          className={`p-5 text-left rounded-2xl border-2 flex gap-4 items-center transition ${
            active
              ? 'bg-orange-300 text-black border-orange-300'
              : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
          }`}
        >
          <p className="text-3xl flex-shrink-0">{emoji}</p>
          <div>
            <p className="font-bold">
              {option}
            </p>
            <p className={`text-xs ${active ? 'text-black' : 'text-gray-300'}`}>
              {active ? 'Selected' : 'Tap to choose'}
            </p>
          </div>
        </button>
      )
    })}
  </div>
)
