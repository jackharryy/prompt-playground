import { motion, AnimatePresence } from 'framer-motion'

interface SpellPreviewProps {
  story: string
  visible: boolean
}

export const SpellPreview = ({ story, visible }: SpellPreviewProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="bg-gray-800 border-2 border-gray-700 rounded-3xl p-5"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p 
            className="text-xs font-bold text-yellow-300 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            SPELL READY
          </motion.p>
          <motion.p 
            className="text-sm mt-3 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {story}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
