// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css';

import {
  connectorsForWallets,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http, WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';

export function Providers({ children }: { children: React.ReactNode }) {
  const connectors = connectorsForWallets(
    [
      {
        groupName: 'Recommended',
        wallets: [
          injectedWallet,
        ]
      },
    ],
    {
      appName: 'Fangorn',
      projectId: 'dummy-id',
    }
  );

  const config = createConfig({
    connectors,
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
    ssr: true,
  });
  const queryClient = new QueryClient()

  return (
 <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}