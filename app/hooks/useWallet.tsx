// ============================================
// WALLET HOOK

import { useState } from "react";

// ============================================
export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    setConnecting(true);
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        // TODO: is this ok for now?
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAddress(accounts[0]);
      } catch (err) {
        console.error('Failed to connect wallet:', err);
      }
    } else {
      await new Promise(r => setTimeout(r, 1000));
      setAddress('0x7a3d8f2c9b4e1a6d5c3f8e2b9a4d7c1e6f3b8a2c');
    }
    setConnecting(false);
  };

  const disconnect = () => setAddress(null);

  return { address, connecting, connect, disconnect };
};