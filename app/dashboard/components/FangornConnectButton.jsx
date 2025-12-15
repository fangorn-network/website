import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function FangornConnectButton({
        classNameOverride,
      }) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

        return (
          <div>
            {!connected ? (
              <button 
                onClick={openConnectModal}
                className= {classNameOverride}
              >
                Connect Wallet
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                {chain.unsupported ? (
                  <button onClick={openChainModal}>
                    Wrong network
                  </button>
                ) : (
                  <button onClick={openChainModal}>
                    {chain.name}
                  </button>
                )}
                <button onClick={openAccountModal}>
                  {account.displayName}
                  {account.displayBalance && ` (${account.displayBalance})`}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}