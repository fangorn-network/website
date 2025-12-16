import FangornConnectButton from "./components/FangornConnectButton";

// ============================================
interface SidebarProps {
  activeView: 'dashboard' | 'library';
  onViewChange: (view: 'dashboard' | 'library') => void;
}

export const AppSidebar = ({ activeView, onViewChange }: SidebarProps) => {
  return (
    <aside className="sidebar">
      <div className="logo">Fangorn</div>
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
        <FangornConnectButton className = "btn-connect-sidebar"/>
      </div>
    </aside>
  );
};