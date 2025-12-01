export const metadata = {
  title: 'Fangorn - Programmable Access Control',
  description: 'Encrypt data under public conditions. Cryptography enforces access.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
