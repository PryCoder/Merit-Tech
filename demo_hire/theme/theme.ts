// theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },

  styles: {
    global: {
      'html, body': {
        backgroundColor: '#050507',
        color: 'white',
      },
    },
  },

  colors: {
    brand: {
      lime: '#C8F135',
    },
  },
});

export default theme;
