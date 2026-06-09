import { motion } from 'framer-motion'
import type { StepCardItem } from '../data/story'

interface StepCardsProps {
  cards: StepCardItem[]
}

const getCategoryColor = (categoryKey: string): { bg: string; border: string; text: string } => {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    character: { bg: 'bg-yellow-300/20', text: 'text-yellow-400', border: 'border-yellow-300' },
    action: { bg: 'bg-blue-300/20', text: 'text-blue-400', border: 'border-blue-300' },
    topic: { bg: 'bg-purple-400/20', text: 'text-purple-400', border: 'border-purple-400' },
    style: { bg: 'bg-pink-300/20', text: 'text-pink-400', border: 'border-pink-300' },
  }
  return colors[categoryKey] || { bg: '', border: '', text: 'text-white' }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
}

export const StepCards = ({ cards }: StepCardsProps) => {
  const currentStep = cards.findIndex(c => c.active)
  
  return (
  <motion.div 
    className="grid grid-cols-1 md:grid-cols-4 gap-4"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {cards.map((card, idx) => {
      const isCompleted = idx < currentStep && card.unlocked
      const colors = getCategoryColor(card.key)
      
      return (
        <motion.div
          key={card.key}
          className={`border-2 rounded-3xl p-5 text-center relative ${
            card.active
              ? `${colors.bg} ${colors.text} ${colors.border}`
              : isCompleted
                ? `${colors.bg} ${colors.text} ${colors.border} opacity-70`
                : 'bg-gray-700 text-white border-gray-600'
          }`}
          variants={cardVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <p className="text-5xl">{card.icon}</p>
          <p className="text-md font-bold tracking-widest mt-3">
            {card.label}
          </p>
          <p className="text-md mt-2 font-bold">
            {card.value}
          </p>
          {!card.unlocked && (
            <motion.div 
              className="mt-2 h-6 flex flex-col items-center justify-center"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
            <p className="text-xs mt-2 text-gray-400">
              locked
            </p>
            <p>🔒</p>
            </motion.div>
          )}
                    {isCompleted && (
            <motion.div
              className='mt-2'
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              ✅
            </motion.div>
          )}
        </motion.div>
      )
    })}
  </motion.div>
  )
}
