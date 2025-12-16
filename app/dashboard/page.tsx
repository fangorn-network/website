'use client';

import {useState} from 'react';
import {useAccount} from 'wagmi';
import './page.css';
import FangornConnectButton from "./components/FangornConnectButton";
import { formatFileSize, shortenAddress, shortenCid } from './utils';
import { Sidebar } from 'lucide-react';
import { UploadConfig, UploadModal } from './uploadModal';
import { AppSidebar } from './sidebar';
import Lit from './lit';
import { create } from '@storacha/client';
import uploadToStoracha from './upload';
import { useStoracha } from '../hooks/useStoracha';
import { useRegistry } from '../hooks/useRegistry';

// ============================================
// TYPES
// ============================================
interface Asset {
  id: string;
  title: string;
  type: 'PDF' | 'Directory' | 'Audio' | 'Video' | 'Image';
  cid: string;
  contractAddress: string;
  minted: number;
  maxSupply: number | null;
  price: number;
  royalty: number;
  earned: number;
  createdAt: string;
}

// ============================================
// MOCK DATA
// ============================================
const MOCK_ASSETS: Asset[] = [
  // {
  //   id: '1',
  //   title: 'The Forest Protocol',
  //   type: 'PDF',
  //   cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
  //   contractAddress: '0x7a3d8f2c9b4e1a6d5c3f8e2b9a4d7c1e6f3b8a2c',
  //   minted: 89,
  //   maxSupply: 500,
  //   price: 0.05,
  //   royalty: 10,
  //   earned: 1.82,
  //   createdAt: '2024-12-01',
  // },
  // {
  //   id: '2',
  //   title: 'Design System v2',
  //   type: 'Directory',
  //   cid: 'bafybeiff7etrfgsfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fdef',
  //   contractAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  //   minted: 43,
  //   maxSupply: 100,
  //   price: 0.12,
  //   royalty: 10,
  //   earned: 0.89,
  //   createdAt: '2024-11-28',
  // },
  // {
  //   id: '3',
  //   title: 'Ambient Collection',
  //   type: 'Audio',
  //   cid: 'bafybeighmjfgsfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzzz',
  //   contractAddress: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
  //   minted: 15,
  //   maxSupply: 50,
  //   price: 0.08,
  //   royalty: 10,
  //   earned: 0.14,
  //   createdAt: '2024-11-15',
  // },
];

// ============================================
// ASSET DETAIL MODAL
// ============================================
interface AssetDetailModalProps {
  asset: Asset | null;
  onClose: () => void;
}

const AssetDetailModal = ({ asset, onClose }: AssetDetailModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  // TODO: should be based on prod v.s. local
  // const shareUrl = `https://fangorn.network/asset/${asset.c  id}`;
  const shareUrl = `http://localhost:3000/asset/${asset.cid}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Asset Details</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="detail-header">
            <div className="detail-preview">
              <span className="preview-type">{asset.type}</span>
            </div>
            <div className="detail-info">
              <div className="detail-title">{asset.title}</div>
              <div className="detail-meta">
                <div>CID: {shortenCid(asset.cid)}</div>
                <div>Contract: {shortenAddress(asset.contractAddress)}</div>
              </div>
            </div>
          </div>

          <div className="detail-stats">
            <div className="detail-stat">
              <div className="detail-stat-value">
                {asset.minted}/{asset.maxSupply || '∞'}
              </div>
              <div className="detail-stat-label">Minted</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-value">{asset.price}</div>
              <div className="detail-stat-label">Price (ETH)</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-value">{asset.royalty}%</div>
              <div className="detail-stat-label">Royalty</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-value">{asset.earned}</div>
              <div className="detail-stat-label">Earned (ETH)</div>
            </div>
          </div>

          <div className="share-section">
            <div className="share-label">Shareable Link</div>
            <div className="share-url">
              <input
                type="text"
                className="share-input"
                value={shareUrl}
                readOnly
              />
              <button className="btn-copy" onClick={copyLink}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CONNECT PROMPT
// ============================================

const ConnectPrompt = () => (
  <div className="connect-prompt">
    <div className="connect-icon">🔐</div>
    <h2>Connect Your Wallet</h2>
    <p>Connect your wallet to view your dashboard and start creating tokenized content.</p>
    <FangornConnectButton className = "btn-primary btn-large"/>
  </div>
);

// ============================================
// DASHBOARD VIEW
// ============================================
interface DashboardViewProps {
  assets: Asset[];
  onUploadClick: () => void;
  onAssetClick: (asset: Asset) => void;
}

const DashboardView = ({ assets, onUploadClick, onAssetClick }: DashboardViewProps) => {
  const totalEarned = assets.reduce((sum, a) => sum + a.earned, 0);
  const totalMinted = assets.reduce((sum, a) => sum + a.minted, 0);
  const royaltiesEarned = totalEarned * 0.15;

  return (
    <>
      <div className="header">
        <div>
          <h1 className="page-title">Creator Dashboard</h1>
          <p className="page-subtitle">Manage your tokenized content</p>
        </div>
        <button className="btn-primary" onClick={onUploadClick}>
          + Upload Content
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">
            {totalEarned.toFixed(3)}<span className="currency">ETH</span>
          </div>
          <div className="stat-change">+0.34 ETH this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tokens Sold</div>
          <div className="stat-value">{totalMinted}</div>
          <div className="stat-change">Across {assets.length} assets</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Royalties Earned</div>
          <div className="stat-value">
            {royaltiesEarned.toFixed(3)}<span className="currency">ETH</span>
          </div>
          <div className="stat-change">From secondary sales</div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Your Assets</h2>
      </div>

      {assets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No assets yet</h3>
          <p>Upload your first piece of content to get started.</p>
          <button className="btn-primary" onClick={onUploadClick}>
            + Upload Content
          </button>
        </div>
      ) : (
        <div className="assets-grid">
          {assets.map(asset => (
            <div
              key={asset.id}
              className="asset-card"
              onClick={() => onAssetClick(asset)}
            >
              <div className="asset-preview">
                <span className="asset-type-badge">{asset.type}</span>
                <span className="preview-placeholder">[Preview]</span>
              </div>
              <div className="asset-body">
                <div className="asset-title">{asset.title}</div>
                <div className="asset-cid">{asset.cid}</div>
                <div className="asset-stats">
                  <div className="asset-stat">
                    <div className="asset-stat-value">
                      {asset.minted}/{asset.maxSupply || '∞'}
                    </div>
                    <div className="asset-stat-label">Minted</div>
                  </div>
                  <div className="asset-stat">
                    <div className="asset-stat-value">{asset.price}</div>
                    <div className="asset-stat-label">Price (ETH)</div>
                  </div>
                  <div className="asset-stat">
                    <div className="asset-stat-value">{asset.earned}</div>
                    <div className="asset-stat-label">Earned</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// ============================================
// LIBRARY VIEW
// ============================================
const LibraryView = () => (
  <>
    <div className="header">
      <div>
        <h1 className="page-title">My Library</h1>
        <p className="page-subtitle">Content you have access to</p>
      </div>
    </div>
    <div className="empty-state">
      <div className="empty-icon">📚</div>
      <h3>No tokens yet</h3>
      <p>Purchase access to content to see it here.</p>
    </div>
  </>
);

// ============================================
// MAIN PAGE
// ============================================
export default function Page() {

  const registry = useRegistry();

  const { upload, uploading } = useStoracha();

  const [activeView, setActiveView] = useState<'dashboard' | 'library'>('dashboard');
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState('');
    const { address, isConnected } = useAccount();

  const handleUpload = async (file: File, config: UploadConfig) => {
    // TODO: encrypt the file for an erc-2981 token
    // for now it's just a positive eth balance
    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "ethereum",
        method: "eth_getBalance",
        parameters: [":userAddress", "latest"],
        returnValueTest: {
          comparator: ">=",
          value: "1000000000000", // 0.000001 ETH
        },
      },
    ];

    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const byteArray = new Uint8Array(arrayBuffer)
      
      // TODO: should probably build a `useLit()` hook
      // connect to LIT network
      const chain = 'ethereum'
      let litClient = new Lit(chain)
      await litClient.connect();

      try {
        setIsDeploying(true);
        setDeployStatus('Encrypting file...');
        let { ciphertext, dataToEncryptHash } = await litClient.encrypt(new TextDecoder().decode(byteArray), accessControlConditions)
        setDeployStatus('Uploading to Storage...');
        const cid = await upload(ciphertext, file.name)
        console.log("Upload to storacha with CID " + cid);
        // this is where stuff should happen
        // Coleman
        // this can probably just be one call
        setDeployStatus('Deploying contract...');
        await new Promise(r => setTimeout(r, 2000));
        setDeployStatus('Registering asset...');
        await new Promise(r => setTimeout(r, 800));

        const newAsset: Asset = {
          id: String(Date.now()),
          title: config.title,
          type: file.type.includes('pdf') ? 'PDF' :
            file.type.includes('audio') ? 'Audio' :
              file.type.includes('video') ? 'Video' :
                file.type.includes('image') ? 'Image' : 'Directory',
          cid: cid,
          contractAddress: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          minted: 0,
          maxSupply: config.maxSupply ? parseInt(config.maxSupply) : null,
          price: parseFloat(config.price),
          royalty: parseInt(config.royalty),
          earned: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };

        setAssets(prev => [newAsset, ...prev]);

      } catch (err) {
        console.error('Error during encryption: ' + err);
      } finally {
      // disconnect lit client
      await litClient.getClient()?.disconnect();
      }
    }

    reader.readAsArrayBuffer(file);

    // const newAsset: Asset = {
    //   id: String(Date.now()),
    //   title: config.title,
    //   type: file.type.includes('pdf') ? 'PDF' :
    //     file.type.includes('audio') ? 'Audio' :
    //       file.type.includes('video') ? 'Video' :
    //         file.type.includes('image') ? 'Image' : 'Directory',
    //   cid: 'bafybei' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    //   contractAddress: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    //   minted: 0,
    //   maxSupply: config.maxSupply ? parseInt(config.maxSupply) : null,
    //   price: parseFloat(config.price),
    //   royalty: parseInt(config.royalty),
    //   earned: 0,
    //   createdAt: new Date().toISOString().split('T')[0],
    // };

    // setAssets(prev => [newAsset, ...prev]);
    setIsDeploying(false);
    setDeployStatus('');
    setShowUploadModal(false);
  };

  return (
    <div className="app">
      <AppSidebar
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <main className="main">
        {!isConnected ? (
          <ConnectPrompt />
        ) : activeView === 'dashboard' ? (
          <DashboardView
            assets={assets}
            onUploadClick={() => setShowUploadModal(true)}
            onAssetClick={setSelectedAsset}
          />
        ) : (
          <LibraryView />
        )}
      </main>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleUpload}
        isDeploying={isDeploying}
        deployStatus={deployStatus}
      />

      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
}