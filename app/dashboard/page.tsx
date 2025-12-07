'use client';

import React, { useState, useCallback, useRef } from 'react';
import './page.css';
import { useWallet } from '../hooks/useWallet';
import { formatFileSize, shortenAddress, shortenCid } from './utils';
import { Sidebar } from 'lucide-react';
import { UploadConfig, UploadModal } from './uploadModal';
import { AppSidebar } from './sidebar';
import Lit from './lit';

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
  {
    id: '1',
    title: 'The Forest Protocol',
    type: 'PDF',
    cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    contractAddress: '0x7a3d8f2c9b4e1a6d5c3f8e2b9a4d7c1e6f3b8a2c',
    minted: 89,
    maxSupply: 500,
    price: 0.05,
    royalty: 10,
    earned: 1.82,
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    title: 'Design System v2',
    type: 'Directory',
    cid: 'bafybeiff7etrfgsfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fdef',
    contractAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    minted: 43,
    maxSupply: 100,
    price: 0.12,
    royalty: 10,
    earned: 0.89,
    createdAt: '2024-11-28',
  },
  {
    id: '3',
    title: 'Ambient Collection',
    type: 'Audio',
    cid: 'bafybeighmjfgsfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzzz',
    contractAddress: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
    minted: 15,
    maxSupply: 50,
    price: 0.08,
    royalty: 10,
    earned: 0.14,
    createdAt: '2024-11-15',
  },
];

// // ============================================
// // UPLOAD MODAL
// // ============================================
// interface UploadModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (file: File, config: UploadConfig) => void;
//   isDeploying: boolean;
//   deployStatus: string;
// }

// const UploadModal = ({ isOpen, onClose, onSubmit, isDeploying, deployStatus }: UploadModalProps) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [config, setConfig] = useState<UploadConfig>({
//     title: '',
//     description: '',
//     price: '',
//     maxSupply: '',
//     royalty: '10',
//   });
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleDrag = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//   }, []);

//   const handleDragIn = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   }, []);

//   const handleDragOut = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   }, []);

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//     const files = e.dataTransfer.files;
//     if (files?.[0]) {
//       setSelectedFile(files[0]);
//       if (!config.title) {
//         setConfig(c => ({
//           ...c,
//           title: files[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
//         }));
//       }
//     }
//   }, [config.title]);

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files?.[0]) {
//       setSelectedFile(files[0]);
//       if (!config.title) {
//         setConfig(c => ({
//           ...c,
//           title: files[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
//         }));
//       }
//     }
//   };

//   const handleSubmit = () => {
//     if (selectedFile && config.title && config.price) {
//       onSubmit(selectedFile, config);
//     }
//   };

//   const resetAndClose = () => {
//     if (isDeploying) return;
//     setSelectedFile(null);
//     setConfig({ title: '', description: '', price: '', maxSupply: '', royalty: '10' });
//     onClose();
//   };

//   const isValid = selectedFile && config.title.trim() && config.price.trim() && config.royalty.trim();

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay active" onClick={resetAndClose}>
//       <div className="modal" onClick={e => e.stopPropagation()}>
//         <div className="modal-header">
//           <h2 className="modal-title">{isDeploying ? 'Deploying...' : 'Upload Content'}</h2>
//           {!isDeploying && (
//             <button className="modal-close" onClick={resetAndClose}>&times;</button>
//           )}
//         </div>

//         <div className="modal-body">
//           {isDeploying ? (
//             <div className="deploy-progress">
//               <div className="deploy-spinner" />
//               <div className="deploy-status">{deployStatus}</div>
//             </div>
//           ) : (
//             <>
//               <div
//                 className={`upload-zone ${isDragging ? 'dragover' : ''} ${selectedFile ? 'has-file' : ''}`}
//                 onDragEnter={handleDragIn}
//                 onDragLeave={handleDragOut}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   onChange={handleFileSelect}
//                   style={{ display: 'none' }}
//                 />
//                 {selectedFile ? (
//                   <div className="selected-file">
//                     <div className="file-icon">📄</div>
//                     <div className="file-details">
//                       <div className="file-name">{selectedFile.name}</div>
//                       <div className="file-size">{formatFileSize(selectedFile.size)}</div>
//                     </div>
//                     <button
//                       className="btn-change"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         fileInputRef.current?.click();
//                       }}
//                     >
//                       Change
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="upload-icon">↑</div>
//                     <div className="upload-text">Drop file or directory here</div>
//                     <div className="upload-hint">PDF, images, audio, video, or folders</div>
//                   </>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Title *</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   placeholder="My Creative Work"
//                   value={config.title}
//                   onChange={e => setConfig(c => ({ ...c, title: e.target.value }))}
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Description</label>
//                 <textarea
//                   className="form-input form-textarea"
//                   placeholder="A brief description..."
//                   value={config.description}
//                   onChange={e => setConfig(c => ({ ...c, description: e.target.value }))}
//                   rows={2}
//                 />
//               </div>

//               <div className="form-row">
//                 <div className="form-group">
//                   <label className="form-label">Price (ETH) *</label>
//                   <input
//                     type="text"
//                     className="form-input"
//                     placeholder="0.05"
//                     value={config.price}
//                     onChange={e => setConfig(c => ({ ...c, price: e.target.value }))}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label className="form-label">Max Supply</label>
//                   <input
//                     type="text"
//                     className="form-input"
//                     placeholder="Unlimited"
//                     value={config.maxSupply}
//                     onChange={e => setConfig(c => ({ ...c, maxSupply: e.target.value }))}
//                   />
//                   <div className="form-hint">Leave empty for unlimited</div>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Royalty % *</label>
//                 <input
//                   type="text"
//                   className="form-input"
//                   placeholder="10"
//                   value={config.royalty}
//                   onChange={e => setConfig(c => ({ ...c, royalty: e.target.value }))}
//                 />
//                 <div className="form-hint">Percentage earned on secondary sales (ERC-2981)</div>
//               </div>
//             </>
//           )}
//         </div>

//         {!isDeploying && (
//           <div className="modal-footer">
//             <button className="btn-secondary" onClick={resetAndClose}>Cancel</button>
//             <button
//               className="btn-primary"
//               onClick={handleSubmit}
//               disabled={!isValid}
//             >
//               Encrypt & Deploy
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

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

  const shareUrl = `https://fangorn.network/asset/${asset.id}`;

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
interface ConnectPromptProps {
  wallet: ReturnType<typeof useWallet>;
}

const ConnectPrompt = ({ wallet }: ConnectPromptProps) => (
  <div className="connect-prompt">
    <div className="connect-icon">🔐</div>
    <h2>Connect Your Wallet</h2>
    <p>Connect your wallet to view your dashboard and start creating tokenized content.</p>
    <button
      className="btn-primary btn-large"
      onClick={wallet.connect}
      disabled={wallet.connecting}
    >
      {wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
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
  const wallet = useWallet();
  const [activeView, setActiveView] = useState<'dashboard' | 'library'>('dashboard');
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState('');

  const handleUpload = async (file: File, config: UploadConfig) => {
    // connect to LIT network
    const chain = 'ethereum'
    let litClient = new Lit(chain)
    await litClient.connect();
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
      try {
        await litClient.encrypt(new TextDecoder().decode(byteArray), accessControlConditions)
        console.log('encrypted the data')
      } catch (err) {
        console.error('Error during encryption: ' + err);
      }
    }

    reader.readAsArrayBuffer(file);

    // await litClient.encrypt(file.btoa(), accessControlConditions)

    // add to IPFS
    // deploy contract (ERC-2981)
    // register asset (global registry)

    setIsDeploying(true);

    setDeployStatus('Encrypting file...');
    await new Promise(r => setTimeout(r, 1000));

    setDeployStatus('Uploading to IPFS...');
    await new Promise(r => setTimeout(r, 1500));

    setDeployStatus('Deploying contract...');
    await new Promise(r => setTimeout(r, 2000));

    setDeployStatus('Registering asset...');
    await new Promise(r => setTimeout(r, 800));

    // TODO: this file selection is weird
    // TODO: get real parameters (cid, contract, etc)
    // the cid generation is fake
    // the contract address is fake
    const newAsset: Asset = {
      id: String(Date.now()),
      title: config.title,
      type: file.type.includes('pdf') ? 'PDF' :
        file.type.includes('audio') ? 'Audio' :
          file.type.includes('video') ? 'Video' :
            file.type.includes('image') ? 'Image' : 'Directory',
      cid: 'bafybei' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      contractAddress: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      minted: 0,
      maxSupply: config.maxSupply ? parseInt(config.maxSupply) : null,
      price: parseFloat(config.price),
      royalty: parseInt(config.royalty),
      earned: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAssets(prev => [newAsset, ...prev]);
    setIsDeploying(false);
    setDeployStatus('');
    setShowUploadModal(false);

    // disconnect lit client
    await litClient.getClient()?.disconnect();
  };

  return (
    <div className="app">
      <AppSidebar
        wallet={wallet}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <main className="main">
        {!wallet.address ? (
          <ConnectPrompt wallet={wallet} />
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