import type { Metadata } from 'next';
import {
  Playfair_Display,
  Inter,
  Bebas_Neue,
  Syne,
  DM_Sans,
  Space_Mono,
  Instrument_Serif,
} from 'next/font/google';
import { GeistSans, GeistMono } from 'geist/font';
import { Providers } from './providers';
import './globals.css';
import { cn } from '@/lib/utils';

// Google fonts
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});

// Metadata
export const metadata: Metadata = {
  title: 'The Merit-Loop Engine',
  description: 'Democratize Technical Hiring. Prove Raw Potential.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

// Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        playfair.variable,
        inter.variable,
        bebas.variable,
        syne.variable,
        dmSans.variable,
        spaceMono.variable,
        instrumentSerif.variable,
        GeistSans.variable,
        GeistMono.variable,
        'font-sans dark'
      )}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
