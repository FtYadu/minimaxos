import type { Metadata } from 'next';
import SettingsModal from '@/components/SettingsModal';
import CommandPalette from '@/components/CommandPalette';
import './globals.css';

export const metadata: Metadata = {
  title: 'MiniMax Studio - AI Content Generation Platform',
  description: 'Professional platform for video, image, text, and music generation using MiniMax API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>        {children}
        <SettingsModal />
        <CommandPalette />
      </body>
    </html>
  );
}
