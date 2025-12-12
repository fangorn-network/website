'use client';

import React, { useState } from 'react';
import './page.css';
import { useWallet } from '@/app/hooks/useWallet';
import { shortenAddress, shortenCid } from './utils';
import { AssetData } from '@/app/common/types';

// ============================================
// MOCK DATA
// ============================================
const MOCK_ASSET: AssetData = {
    // id: 'fangorn-asset-0047',
    title: 'The Forest Protocol',
    description: 'A comprehensive guide to building decentralized access control systems using threshold cryptography. Covers witness encryption fundamentals, policy-based access patterns, and practical implementation strategies for token-gated content distribution.',
    type: 'PDF',
    fileSize: '2.4 MB',
    cid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    contractAddress: '0x7a3d8f2c9b4e1a6d5c3f8e2b9a4d7c1e6f3b2c4e',
    // registryId: 'fangorn:asset:0x7a3d...0047',
    contentType: 'application/pdf',
    createdAt: 'Dec 1, 2024',
    price: BigInt(0.05),
    priceUsd: 187.50,
    minted: 89,
    maxSupply: 500,
    royalty: 10,
    creator: {
        address: '0x7a3d8f2c9b4e1a6d5c3f8e2b9a4d7c1e6f3b8a2c',
        name: 'ideallabs.eth',
    },
};

// ============================================
// HEADER
// ============================================
interface HeaderProps {
    wallet: ReturnType<typeof useWallet>;
    onLogoClick?: () => void;
}

const Header = ({ wallet, onLogoClick }: HeaderProps) => (
    <header className="asset-header">
        <button className="header-logo" onClick={onLogoClick}>
            Fangorn
            <span className="header-logo-sub">Liquid Access Rights</span>
        </button>

        {wallet.address ? (
            <div className="wallet-connected">
                <div className="wallet-indicator" />
                <span className="wallet-address">{shortenAddress(wallet.address)}</span>
            </div>
        ) : (
            <button
                className="btn-connect"
                onClick={wallet.connect}
                disabled={wallet.connecting}
            >
                {wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
        )}
    </header>
);

// ============================================
// PREVIEW SECTION
// ============================================
interface PreviewProps {
    asset: AssetData;
    hasAccess: boolean;
}

const Preview = ({ asset, hasAccess }: PreviewProps) => (
    <div className="asset-preview">
        <span className="preview-badge">{asset.type} · {asset.fileSize}</span>
        {!hasAccess && (
            <div className="preview-locked">
                <div className="lock-icon">🔒</div>
                <div className="lock-text">Purchase to unlock</div>
            </div>
        )}
        <span className="preview-placeholder">[{hasAccess ? 'Preview' : 'Blurred Preview'}]</span>
    </div>
);

// ============================================
// CREATOR INFO
// ============================================
interface CreatorInfoProps {
    creator: AssetData['creator'];
}

const CreatorInfo = ({ creator }: CreatorInfoProps) => (
    <div className="asset-creator">
        <div className="creator-avatar">
            {creator.name?.slice(0, 2).toUpperCase()}
        </div>
        <div className="creator-info">
            <div className="creator-label">Created by</div>
            <div className="creator-name">{creator.name}</div>
        </div>
    </div>
);

// ============================================
// METADATA
// ============================================
interface MetadataProps {
    asset: AssetData;
}

const Metadata = ({ asset }: MetadataProps) => (
    <div className="asset-meta">
        <div className="meta-title">Asset Details</div>
        <div className="meta-row">
            <span className="meta-label">Content ID (CID)</span>
            <span className="meta-value mono">{shortenCid(asset.cid)}</span>
        </div>
        <div className="meta-row">
            <span className="meta-label">Contract</span>
            <span className="meta-value">
                <a href={`https://etherscan.io/address/${asset.contractAddress}`} target="_blank" rel="noopener noreferrer">
                    {shortenAddress(asset.contractAddress)}
                </a>
            </span>
        </div>
        {/* <div className="meta-row">
            <span className="meta-label">Registry ID</span>
            <span className="meta-value">{asset.registryId}</span>
        </div> */}
        <div className="meta-row">
            <span className="meta-label">Content Type</span>
            <span className="meta-value">{asset.contentType}</span>
        </div>
        <div className="meta-row">
            <span className="meta-label">Created</span>
            <span className="meta-value">{asset.createdAt}</span>
        </div>
    </div>
);

// ============================================
// PRICE SECTION
// ============================================
interface PriceSectionProps {
    asset: AssetData;
}

const PriceSection = ({ asset }: PriceSectionProps) => (
    <div className="price-section">
        <div className="price-label">Price</div>
        <div className="price-value">
            {Number(asset.price)}
            <span className="price-currency">ETH</span>
        </div>
        <div className="price-usd">≈ ${asset.priceUsd?.toFixed(2)} USD</div>
    </div>
);

// ============================================
// SUPPLY SECTION
// ============================================
interface SupplySectionProps {
    minted: number;
    maxSupply: number | null;
}

const SupplySection = ({ minted, maxSupply }: SupplySectionProps) => {
    const percentage = maxSupply ? (minted / maxSupply) * 100 : 0;

    return (
        <div className="supply-section">
            <div className="supply-bar">
                <div className="supply-fill" style={{ width: `${percentage}%` }} />
            </div>
            <div className="supply-text">
                <span className="supply-minted">{minted} minted</span>
                <span className="supply-max">{maxSupply || '∞'} max</span>
            </div>
        </div>
    );
};

// ============================================
// PURCHASE CARD - NOT CONNECTED
// ============================================
interface NotConnectedCardProps {
    asset: AssetData;
    onConnect: () => void;
}

const NotConnectedCard = ({ asset, onConnect }: NotConnectedCardProps) => (
    <div className="purchase-card">
        <div className="no-wallet-banner">
            <div className="no-wallet-text">
                Connect your wallet to purchase access or check if you already own a token.
            </div>
            <button className="btn-connect-inline" onClick={onConnect}>
                Connect Wallet
            </button>
        </div>

        <PriceSection asset={asset} />
        <SupplySection minted={asset.minted} maxSupply={asset.maxSupply} />

        <div className="royalty-badge">
            Creator royalty: <span>{asset.royalty}%</span> on resales
        </div>

        <button className="btn-buy" disabled>
            Connect Wallet to Purchase
        </button>

        <div className="purchase-note">
            Purchasing mints an ERC-721/ERC-2981 (TODO) token that grants decryption access.
            Token can be resold on any NFT marketplace (limitations apply).
        </div>
    </div>
);

// ============================================
// PURCHASE CARD - CONNECTED, NO TOKEN
// ============================================
interface NoTokenCardProps {
    asset: AssetData;
    onBuy: () => void;
    isBuying: boolean;
}

const NoTokenCard = ({ asset, onBuy, isBuying }: NoTokenCardProps) => (
    <div className="purchase-card">
        <PriceSection asset={asset} />
        <SupplySection minted={asset.minted} maxSupply={asset.maxSupply} />

        <div className="royalty-badge">
            Creator royalty: <span>{asset.royalty}%</span> on resales
        </div>

        <button className="btn-buy" onClick={onBuy} disabled={isBuying}>
            {isBuying ? 'Confirming...' : 'Buy Access'}
        </button>
        <button className="btn-secondary">View on OpenSea</button>

        <div className="purchase-note">
            Purchasing mints an ERC-721/ERC-2981 (TODO) token that grants decryption access.
            Token can be resold on any NFT marketplace.
        </div>
    </div>
);

// ============================================
// PURCHASE CARD - HAS ACCESS
// ============================================
interface HasAccessCardProps {
    tokenId: string;
    onDecrypt: () => void;
    decryptStatus: string;
    isDecrypting: boolean;
}

const HasAccessCard = ({ tokenId, onDecrypt, decryptStatus, isDecrypting }: HasAccessCardProps) => (
    <div className="purchase-card">
        <div className="access-banner">
            <span className="access-icon">✓</span>
            <div className="access-text">
                <div className="access-title">You have access</div>
                <div className="access-detail">Token #{tokenId} in your wallet</div>
            </div>
        </div>

        <button
            className={`btn-decrypt ${decryptStatus === 'Download Started ↓' ? 'success' : ''}`}
            onClick={onDecrypt}
            disabled={isDecrypting}
        >
            {decryptStatus || 'Decrypt & Download'}
        </button>
        <button className="btn-secondary">List for Sale</button>

        <div className="purchase-note">
            Decryption happens in your browser. The file never passes through our servers unencrypted.
        </div>
    </div>
);

// ============================================
// ASSET PAGE COMPONENT
// ============================================
interface AssetPageProps {
    assetId?: string;
    onLogoClick?: () => void;
}

// function fetchAsset(assetId) {

// }

export default function AssetPage({ assetId, onLogoClick }: AssetPageProps) {
    // Wallet state
    const wallet = useWallet();

    // Access state
    const [hasToken, setHasToken] = useState(false);
    const [ownedTokenId, setOwnedTokenId] = useState<string>('47');

    // Action states
    const [isBuying, setIsBuying] = useState(false);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [decryptStatus, setDecryptStatus] = useState('');

    // In real app, fetch asset by assetId
    const asset = MOCK_ASSET

    const handleBuy = async () => {
        setIsBuying(true);
        // TODO: Actual mint transaction
        await new Promise(r => setTimeout(r, 1500));
        setHasToken(true);
        setOwnedTokenId(String(asset.minted + 1));
        setIsBuying(false);
    };

    const handleDecrypt = async () => {
        setIsDecrypting(true);

        setDecryptStatus('Verifying ownership...');
        await new Promise(r => setTimeout(r, 800));

        setDecryptStatus('Fetching key...');
        await new Promise(r => setTimeout(r, 800));

        setDecryptStatus('Decrypting...');
        await new Promise(r => setTimeout(r, 600));

        setDecryptStatus('Download Started ↓');
        await new Promise(r => setTimeout(r, 1300));

        // TODO: Actual decrypt and download
        setDecryptStatus('');
        setIsDecrypting(false);
    };

    return (
        <div className="asset-page">
            <Header wallet={wallet} onLogoClick={onLogoClick} />

            <main className="asset-main">
                <div className="asset-info">
                    <Preview asset={asset} hasAccess={hasToken && !!wallet.address} />
                    <h1 className="asset-title">{asset.title}</h1>
                    <CreatorInfo creator={asset.creator} />
                    <p className="asset-description">{asset.description}</p>
                    <Metadata asset={asset} />
                </div>

                <div className="purchase-column">
                    {!wallet.address ? (
                        <NotConnectedCard asset={asset} onConnect={wallet.connect} />
                    ) : !hasToken ? (
                        <NoTokenCard asset={asset} onBuy={handleBuy} isBuying={isBuying} />
                    ) : (
                        <HasAccessCard
                            tokenId={ownedTokenId}
                            onDecrypt={handleDecrypt}
                            decryptStatus={decryptStatus}
                            isDecrypting={isDecrypting}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}