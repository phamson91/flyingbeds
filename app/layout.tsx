import './globals.css';
import { Inter } from 'next/font/google';
import SupabaseProvider from '@/providers/SupabaseProvider';
import ToasterProvider from '@/providers/ToasterProvider';
import UserProvider from '@/providers/UserProvider';
import 'react-day-picker/dist/style.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Consolidation Services',
  description: 'Consolidation services for air-ticket agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>{children}</UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
