import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import type { StepCardItem } from '../data/story'

interface StepCardsProps {
  cards: StepCardItem[]
}

export const StepCards = ({ cards }: StepCardsProps) => (
  <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
    {cards.map((card) => (
      <Box
        key={card.key}
        bg={card.active ? 'orange.300' : card.unlocked ? 'gray.800' : 'gray.700'}
        color={card.active ? 'black' : 'white'}
        border="2px solid"
        borderColor={card.active ? 'orange.300' : 'gray.600'}
        rounded="3xl"
        p={5}
        textAlign="center"
      >
        <Text fontSize="3xl">{card.icon}</Text>
        <Text fontSize="xs" fontWeight="bold" letterSpacing="widest" mt={3}>
          {card.label}
        </Text>
        <Text fontSize="sm" mt={2} fontWeight="bold">
          {card.value}
        </Text>
        {!card.unlocked && (
          <Text fontSize="xs" mt={2} color="gray.400">
            locked
          </Text>
        )}
      </Box>
    ))}
  </SimpleGrid>
)
