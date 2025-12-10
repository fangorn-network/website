import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const metadata = {
  title: 'Fangorn - Programmable Access Control',
  description: 'Encrypt data under public conditions. Cryptography enforces access.',
};

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}