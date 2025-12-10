import { resolve } from 'path';
import {
  AssetData,
  CreateAssetParams,
  AssetQuery,
  TxResult,
} from '../common/types';
import { IAssetRegistry } from './IAssetRegistry';

/**
 * An in-memory asset registry for local testing
 */
export class MockAssetRegistry implements IAssetRegistry {
  private assets: Map<string, AssetData> = new Map();
  private accessMap: Map<string, Set<string>> = new Map(); // cid -> set of addresses
  // a map of creator spaces (individual registries)
  // maps owner => space name
  private spacesMap: Map<string, string> = new Map();
  private connected: boolean = false;
  private signerAddress: string = '';
  private chainId: number = 31337; // localhost

  async connect(signer: { getAddress: () => Promise<string> }): Promise<void> {
    this.signerAddress = await signer.getAddress();
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.signerAddress = '';
  }

  isConnected(): boolean {
    return this.connected;
  }

  getChainId(): string {
    return this.chainId.toString();
  }

  async getSignerAddress(): Promise<string> {
    this.ensureConnected();
    return this.signerAddress;
  }

  async getAsset(cid: string): Promise<AssetData | null> {
    this.ensureConnected();
    return this.assets.get(cid) ?? null;
  }

  async getAssets(query?: AssetQuery): Promise<AssetData[]> {
    this.ensureConnected();

    let results = Array.from(this.assets.values());

    if (query?.creator) {
      const creatorLower = query.creator.toLowerCase();
      results = results.filter(
        a => a.creator.address.toLowerCase() === creatorLower
      );
    }

    if (query?.contentType) {
      results = results.filter(a => a.contentType === query.contentType);
    }

    const offset = query?.offset ?? 0;
    const limit = query?.limit ?? 100;

    return results.slice(offset, offset + limit);
  }

  async getAssetsByCreator(creator: string): Promise<AssetData[]> {
    return this.getAssets({ creator });
  }

  async getAssetCount(): Promise<number> {
    this.ensureConnected();
    return this.assets.size;
  }

  async hasAccess(cid: string, address: string): Promise<boolean> {
    this.ensureConnected();

    const asset = this.assets.get(cid);
    if (!asset) return false;

    // Creator always has access
    if (asset.creator.address.toLowerCase() === address.toLowerCase()) {
      return true;
    }

    const holders = this.accessMap.get(cid);
    return holders?.has(address.toLowerCase()) ?? false;
  }

  async getAccessTokenBalance(cid: string, address: string): Promise<bigint> {
    const hasAccess = await this.hasAccess(cid, address);
    return hasAccess ? BigInt(1) : BigInt(0);
  }

  async createSpace(address: string, name: string): Promise<null> {

    if (this.spacesMap.get(address) === null) {
      this.spacesMap.set(address, name);
    }

    return new Promise((resolve) => {
      resolve(null)
    });
  }

  async createAsset(params: CreateAssetParams): Promise<TxResult> {
    this.ensureConnected();

    if (this.assets.has(params.cid)) {
      return { hash: '', success: false, error: 'Asset already exists' };
    }

    const asset: AssetData = {
      cid: params.cid,
      title: params.title,
      description: params.description,
      type: this.inferType(params.contentType),
      fileSize: params.fileSize,
      contractAddress: this.randomAddress(),
      contentType: params.contentType,
      createdAt: new Date().toISOString(),
      price: params.price,
      minted: 0,
      maxSupply: params.maxSupply,
      royalty: params.royalty,
      creator: {
        address: this.signerAddress,
      },
    };

    this.assets.set(params.cid, asset);

    return {
      hash: this.randomTxHash(),
      blockNumber: Math.floor(Math.random() * 1000000),
      success: true,
      events: [{
        name: 'AssetCreated',
        args: {
          cid: params.cid,
          creator: this.signerAddress,
          tokenContract: asset.contractAddress,
          price: params.price,
        },
      }],
    };
  }

  async purchaseAccess(cid: string, quantity: number = 1): Promise<TxResult> {
    this.ensureConnected();

    const asset = this.assets.get(cid);
    if (!asset) {
      return { hash: '', success: false, error: 'Asset not found' };
    }

    if (asset.maxSupply !== null && asset.minted + quantity > asset.maxSupply) {
      return { hash: '', success: false, error: 'Exceeds max supply' };
    }

    // Grant access
    if (!this.accessMap.has(cid)) {
      this.accessMap.set(cid, new Set());
    }
    this.accessMap.get(cid)!.add(this.signerAddress.toLowerCase());

    // Update minted count
    asset.minted += quantity;

    return {
      hash: this.randomTxHash(),
      blockNumber: Math.floor(Math.random() * 1000000),
      success: true,
      events: [{
        name: 'AssetPurchased',
        args: {
          cid,
          buyer: this.signerAddress,
          quantity,
          totalPaid: asset.price as bigint * BigInt(quantity),
        },
      }],
    };
  }

  async updateAssetMetadata(
    cid: string,
    title: string,
    description: string
  ): Promise<TxResult> {
    this.ensureConnected();

    const asset = this.assets.get(cid);
    if (!asset) {
      return { hash: '', success: false, error: 'Asset not found' };
    }

    if (asset.creator.address.toLowerCase() !== this.signerAddress.toLowerCase()) {
      return { hash: '', success: false, error: 'Not the creator' };
    }

    asset.title = title;
    asset.description = description;

    return {
      hash: this.randomTxHash(),
      blockNumber: Math.floor(Math.random() * 1000000),
      success: true,
      events: [{
        name: 'AssetUpdated',
        args: { cid, title, description },
      }],
    };
  }

  // no gas needed
  async estimateGas(_method: string, ..._args: unknown[]): Promise<bigint> {
    this.ensureConnected();
    return new Promise<bigint>((resolve) => {
      resolve(BigInt(0));
    });
  }

  // --- Test helpers ---

  seed(assets: AssetData[]): void {
    for (const asset of assets) {
      this.assets.set(asset.cid, asset);
    }
  }

  clear(): void {
    this.assets.clear();
    this.accessMap.clear();
  }

  grantAccess(cid: string, address: string): void {
    if (!this.accessMap.has(cid)) {
      this.accessMap.set(cid, new Set());
    }
    this.accessMap.get(cid)!.add(address.toLowerCase());
  }

  // --- Private ---

  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('Registry not connected. Call connect() first.');
    }
  }

  private randomTxHash(): string {
    const bytes = new Array(32).fill(0).map(() =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    );
    return '0x' + bytes.join('');
  }

  private randomAddress(): string {
    const bytes = new Array(20).fill(0).map(() =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    );
    return '0x' + bytes.join('');
  }

  private inferType(contentType: string): string {
    const mapping: Record<string, string> = {
      'image/jpeg': 'IMAGE',
      'image/png': 'IMAGE',
      'image/gif': 'IMAGE',
      'image/webp': 'IMAGE',
      'video/mp4': 'VIDEO',
      'video/webm': 'VIDEO',
      'audio/mpeg': 'AUDIO',
      'audio/wav': 'AUDIO',
      'application/pdf': 'DOCUMENT',
      'text/plain': 'TEXT',
      'text/markdown': 'TEXT',
    };

    return mapping[contentType.toLowerCase()] ?? 'OTHER';
  }
}