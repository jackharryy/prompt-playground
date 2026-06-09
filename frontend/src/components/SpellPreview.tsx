import { Box, Text } from '@chakra-ui/react'

interface SpellPreviewProps {
  story: string
  visible: boolean
}

export const SpellPreview = ({ story, visible }: SpellPreviewProps) => {
  if (!visible) return null

  return (
    <Box bg="gray.800" border="2px solid" borderColor="gray.700" rounded="3xl" p={5}>
      <Text fontSize="xs" fontWeight="bold" color="yellow.300" letterSpacing="widest">
        SPELL READY
      </Text>
      <Text fontSize="sm" mt={3} color="white">
        {story}
      </Text>
    </Box>
  )
}
