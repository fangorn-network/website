import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect } from 'wagmi';
import { shortenAddress } from '../utils';

export default function FangornConnectButton({
  className
}) {
  const { disconnect } = useDisconnect();

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
                className= {className}
              >
                Connect Wallet
              </button>
            ) : 
              <>
                <div 
                  className="wallet-status"
                  onClick={openChainModal}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease, transform 0.1s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span className="status-dot" />
                  Connected to {chain.name}
                </div>
                <div 
                  className="wallet-address"
                  onClick={openAccountModal}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease, transform 0.1s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {shortenAddress(account.address)}
                </div>
                <button className="btn-disconnect" onClick={() => disconnect()}>
                  Disconnect
                </button>
              </>
            }
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}