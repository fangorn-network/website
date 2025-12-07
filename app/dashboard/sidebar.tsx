
// ============================================
// SIDEBAR

import { useWallet } from "../hooks/useWallet";
import { shortenAddress } from "./utils";

// ============================================
interface SidebarProps {
  wallet: ReturnType<typeof useWallet>;
  activeView: 'dashboard' | 'library';
  onViewChange: (view: 'dashboard' | 'library') => void;
}

export const AppSidebar = ({ wallet, activeView, onViewChange }: SidebarProps) => (
  <aside className="sidebar">
    <div className="logo">// Fangorn</div>
    <div className="logo-sub">Liquid Access Rights</div>

    <nav className="nav">
      <button
        className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
        onClick={() => onViewChange('dashboard')}
      >
        Dashboard
      </button>
      <button
        className={`nav-item ${activeView === 'library' ? 'active' : ''}`}
        onClick={() => onViewChange('library')}
      >
        My Library
      </button>
    </nav>

    <div className="sidebar-footer">
      {wallet.address ? (
        <>
          <div className="wallet-status">
            <span className="status-dot" />
            Connected
          </div>
          <div className="wallet-address">{shortenAddress(wallet.address)}</div>
          <button className="btn-disconnect" onClick={wallet.disconnect}>
            Disconnect
          </button>
        </>
      ) : (
        <button
          className="btn-connect-sidebar"
          onClick={wallet.connect}
          disabled={wallet.connecting}
        >
          {wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  </aside>
);
