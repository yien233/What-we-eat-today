import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chi-dian-sha.yien233.chatgpt.site'),
  title: '吃点啥｜今天吃什么随机抽取器',
  description: '80 种平价即食美味，按类别和预算随机抽取，轻松决定今天吃什么。',
  manifest: '/manifest.webmanifest',
  applicationName: '吃点啥',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '吃点啥',
  },
  icons: {
    icon: [
      { url: '/app-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/app-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/app-icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  openGraph: {
    title: '吃点啥｜今天吃什么随机抽取器',
    description: '选择困难急救站：80 种平价美味，按一下就开饭。',
    images: [{
      url: '/og.png',
      width: 1664,
      height: 936,
      alt: '今天，吃点啥？80 种平价美味，按一下就开饭。',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '吃点啥｜今天吃什么随机抽取器',
    description: '选择困难急救站：80 种平价美味，按一下就开饭。',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#172922',
  colorScheme: 'light',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geist.variable} antialiased`}>{children}</body>
    </html>
  );
}
