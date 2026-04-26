"use client";

import type { ReactNode } from "react";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "var(--font-playfair), var(--font-inter), var(--font-geist-sans), system-ui, sans-serif",
    body: "var(--font-inter), var(--font-geist-sans), system-ui, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  colors: {
    brand: {
      50: "#e8f8f5",
      100: "#c5ede6",
      500: "#2D9B83",
      600: "#1a7a64",
      700: "#1a5c4a",
      800: "#1a3d32",
      900: "#0f2820",
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}