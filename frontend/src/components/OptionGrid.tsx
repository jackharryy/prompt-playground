import { motion } from 'framer-motion'
import type { Category, CategoryKey, SelectedState } from '../data/story'
import { optionEmojis } from '../data/story'

interface OptionGridProps {
  category: Category
  selected: SelectedState
  onSelect: (key: CategoryKey, item: string) => void
  currentStep: number
  loading?: boolean
  error?: string
}

const getCategoryColor = (categoryKey: CategoryKey): { bg: string; border: string; text: string } => {
  const colors = {
    character: { bg: 'bg-yellow-300/20', border: 'border-yellow-300', text: 'text-yellow-400' },
    action: { bg: 'bg-blue-300/20', border: 'border-blue-300', text: 'text-blue-400' },
    topic: { bg: 'bg-purple-400/20', border: 'border-purple-400', text: 'text-purple-400' },
    style: { bg: 'bg-pink-300/20', border: 'border-pink-300', text: 'text-pink-400' },
  }
  return colors[categoryKey]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 0 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
    },
  },
}

const categories = ['character', 'action', 'topic', 'style'] as const

export const OptionGrid = ({ category, selected, onSelect, currentStep, loading, error }: OptionGridProps) => {
  const categoryIndex = categories.indexOf(category.key as typeof categories[number])
  const isPassed = categoryIndex < currentStep
  const colors = getCategoryColor(category.key)

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {error && (
        <div className="col-span-full rounded-2xl border-2 border-red-600 bg-red-900/20 p-4 text-sm text-red-200">
          {error}
        </div>
      )}
      {(loading ? Array.from({ length: 4 }) : category.options).map((option, index) => {
        const active = !loading && selected[category.key] === option
        const emoji = optionEmojis[category.key]?.[index] || '⭐'
        const isSkeleton = loading
        
        const bgColorMap: Record<CategoryKey, string> = {
          character: 'rgba(250, 204, 21, 0.2)',
          action: 'rgba(96, 165, 250, 0.2)',
          topic: 'rgba(168, 85, 247, 0.2)',
          style: 'rgba(236, 72, 153, 0.2)',
        }
        
        const textColorMap: Record<CategoryKey, string> = {
          character: '#facc15',
          action: '#60a5fa',
          topic: '#a855f7',
          style: '#ec4899',
        }
        
        return (
          <motion.button
            key={String(option) + index}
            onClick={() => !isSkeleton && onSelect(category.key, option as string)}
            disabled={loading}
            style={active ? { backgroundColor: bgColorMap[category.key], color: textColorMap[category.key] } : { backgroundColor: '#1f2937', color: 'white' }}
            className={`p-5 text-left rounded-2xl border-2 flex flex-col gap-4 items-center transition relative ${
              active
                ? `${colors.border}`
                : 'border-gray-700 hover:bg-gray-700'
            } ${isPassed && !active ? 'opacity-60' : ''}`}
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: active ? undefined : 'rgb(55, 65, 81)' }}
            whileTap={{ scale: 0.98 }}
          >
            {isSkeleton ? (
              <div className="w-full space-y-3">
                <div className="h-16 rounded-2xl bg-gray-700/60 animate-pulse" />
                <div className="h-4 rounded-full bg-gray-700/60 animate-pulse w-3/4" />
              </div>
            ) : (
              <>
                {isPassed && !active && (
                  <motion.div 
                    className="absolute top-2 right-2 text-xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    ✓
                  </motion.div>
                )}
                <p className="text-6xl flex-shrink-0">{emoji}</p>
                <div>
                  <p className={`font-bold text-xl ${active ? colors.text : 'text-white'}`}>
                    {option}
                  </p>
                </div>
              </>
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
