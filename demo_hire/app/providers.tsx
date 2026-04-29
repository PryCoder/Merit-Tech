'use client';

import type { ReactNode } from 'react';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from '@/theme/theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      {/* ✅ THIS FIXES WHITE FLASH */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
