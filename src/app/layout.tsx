import './globals.css';

import { NextLayout, NextProvider } from '@/components/NextProvider';

import { noto_sans } from '@/lib/fonts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // metadataBase: new URL('https://fastcampus-nextbnb.vercel.app'),
  alternates: {
    canonical: '/',
  },
  title: 'CreatorHub',
  description: 'CreatorHub',
  keywords: ['CreatorHub', 'sns', 'creator', 'youtube', 'twitch'],
  openGraph: {
    title: 'CreatorHub',
    description: 'CreatorHub에서 꿈을 펼처보세요',
    url: 'https://fastcampus-nextbnb.vercel.app',
    siteName: 'CreatorHub',
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={noto_sans.className}>
        <NextProvider>
          <NextLayout>{children}</NextLayout>
        </NextProvider>
      </body>
    </html>
  );
}
