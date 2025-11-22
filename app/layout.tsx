import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Barlingo - Learn Bartending',
  description: 'Master bartending skills with interactive lessons',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
