import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        margin: 0,
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: 'gray.800',
        background: 'linear-gradient(135deg, #86efac 0%, #bef264 40%, #7dd3fc 100%)',
        backgroundAttachment: 'fixed',
      },
    },
  },
  fonts: {
    heading: 'Comic Neue, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  colors: {
    brand: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },
  },
})

export default theme
