import type { StepCardItem } from '../data/story'

interface StepCardsProps {
  cards: StepCardItem[]
}

export const StepCards = ({ cards }: StepCardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {cards.map((card) => (
      <div
        key={card.key}
        className={`border-2 rounded-3xl p-5 text-center ${
          card.active
            ? 'bg-orange-300 text-black border-orange-300'
            : card.unlocked
              ? 'bg-gray-800 text-white border-gray-600'
              : 'bg-gray-700 text-white border-gray-600'
        }`}
      >
        <p className="text-3xl">{card.icon}</p>
        <p className="text-xs font-bold tracking-widest mt-3">
          {card.label}
        </p>
        <p className="text-sm mt-2 font-bold">
          {card.value}
        </p>
        {!card.unlocked && (
          <p className="text-xs mt-2 text-gray-400">
            locked
          </p>
        )}
      </div>
    ))}
  </div>
)
