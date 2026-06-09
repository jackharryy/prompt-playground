import { Box, Heading, Text } from '@chakra-ui/react'

export const SpellHeader = () => (
  <Box bg="gray.900" border="2px solid" borderColor="gray.700" rounded="3xl" p={{ base: 5, md: 8 }}>
    <Text fontSize="xs" fontWeight="bold" color="yellow.300" letterSpacing="widest">
      SPELL CRAFTER
    </Text>
    <Heading size="2xl" mt={3} color="white">
      Build a simple spell
    </Heading>
    <Text fontSize="sm" mt={2} color="gray.400">
      Tap the current step, choose one option, then cast the spell.
    </Text>
  </Box>
)
