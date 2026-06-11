import { motion } from 'framer-motion'

export const SpellHeader = () => (
  <motion.div 
    className="p-5 flex flex-col justify-center items-center"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.p 
      className="text-3xl font-semibold text-yellow-300"
      animate={{ 
        y: [0, -8, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      🦸 AI Hero
    </motion.p>
    <motion.p 
      className="text-sm mt-2 text-gray-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      Pick the pieces and make your very own AI hero
    </motion.p>
  </motion.div>
)
