interface SpellPreviewProps {
  story: string
  visible: boolean
}

export const SpellPreview = ({ story, visible }: SpellPreviewProps) => {
  if (!visible) return null

  return (
    <div className="bg-gray-800 border-2 border-gray-700 rounded-3xl p-5">
      <p className="text-xs font-bold text-yellow-300 tracking-widest">
        SPELL READY
      </p>
      <p className="text-sm mt-3 text-white">
        {story}
      </p>
    </div>
  )
}
