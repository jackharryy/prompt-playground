import { Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import type { Category, CategoryKey, SelectedState } from '../data/story'
import { optionEmojis } from '../data/story'

interface OptionGridProps {
  category: Category
  selected: SelectedState
  onSelect: (key: CategoryKey, item: string) => void
}

export const OptionGrid = ({ category, selected, onSelect }: OptionGridProps) => (
  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3} mt={5}>
    {category.options.map((option, index) => {
      const active = selected[category.key] === option
      const emoji = optionEmojis[category.key]?.[index] || '⭐'
      return (
        <Button
          key={option}
          onClick={() => onSelect(category.key, option)}
          h="auto"
          p={5}
          textAlign="left"
          borderRadius="2xl"
          bg={active ? 'orange.300' : 'gray.800'}
          color={active ? 'black' : 'white'}
          border="2px solid"
          borderColor={active ? 'orange.300' : 'gray.700'}
          _hover={{ bg: active ? 'orange.300' : 'gray.700' }}
        >
          <Flex align="center" gap={4}>
            <Text fontSize="3xl">{emoji}</Text>
            <Box>
              <Text fontSize="md" fontWeight="bold">
                {option}
              </Text>
              <Text fontSize="xs" color={active ? 'black' : 'gray.300'}>
                {active ? 'Selected' : 'Tap to choose'}
              </Text>
            </Box>
          </Flex>
        </Button>
      )
    })}
  </SimpleGrid>
)
