'use client';

import WorldMap from '@/components/ui/world-map';
import { Box } from '@chakra-ui/react';

export function GlobeSections() {
  return (
    <Box w="full" h="full" bg="black">
      <WorldMap
        dots={[
          {
            start: { lat: 64.2, lng: -149.4 },
            end: { lat: 34.05, lng: -118.24 },
          },
          {
            start: { lat: 64.2, lng: -149.4 },
            end: { lat: -15.79, lng: -47.89 },
          },
          {
            start: { lat: -15.79, lng: -47.89 },
            end: { lat: 38.72, lng: -9.13 },
          },
          { start: { lat: 51.5, lng: -0.12 }, end: { lat: 28.61, lng: 77.2 } },
          {
            start: { lat: 28.61, lng: 77.2 },
            end: { lat: 43.13, lng: 131.91 },
          },
          { start: { lat: 28.61, lng: 77.2 }, end: { lat: -1.29, lng: 36.82 } },
        ]}
      />
    </Box>
  );
}
