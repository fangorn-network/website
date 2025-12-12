import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Providers } from './providers'

export const metadata = {
  title: 'Fangorn - Programmable Access Control',
  description: 'Encrypt data under public conditions. Cryptography enforces access.',
};

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}