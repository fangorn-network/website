import { 
  Contract, 
  Signer, 
  providers,
  utils,
  BigNumber,
  ContractTransaction,
  ContractReceipt,
} from 'ethers';

import {
  AssetData, 
  CreateAssetParams, 
  AssetQuery, 
  TxResult,
  ParsedEvent 
} from '../common/types';
import { IAssetRegistry } from './IAssetRegistry';

const REGISTRY_ABI = [
  "event AssetCreated(string indexed cid, address indexed creator, address tokenContract, uint256 price)",
  "event AssetPurchased(string indexed cid, address indexed buyer, uint256 quantity, uint256 totalPaid)",
  "event AssetUpdated(string indexed cid, string title, string description)",
  
  "function getAsset(string cid) view returns (tuple(string cid, string title, string description, string contentType, string fileSize, address tokenContract, uint256 createdAt, uint256 price, uint256 minted, uint256 maxSupply, uint256 royaltyBps, address creator, bool exists))",
  "function getAssets(uint256 limit, uint256 offset) view returns (tuple(string cid, string title, string description, string contentType, string fileSize, address tokenContract, uint256 createdAt, uint256 price, uint256 minted, uint256 maxSupply, uint256 royaltyBps, address creator, bool exists)[])",
  "function getAssetsByCreator(address creator) view returns (tuple(string cid, string title, string description, string contentType, string fileSize, address tokenContract, uint256 createdAt, uint256 price, uint256 minted, uint256 maxSupply, uint256 royaltyBps, address creator, bool exists)[])",
  "function getAssetCount() view returns (uint256)",
  "function hasAccess(string cid, address account) view returns (bool)",
  "function getAccessTokenBalance(string cid, address account) view returns (uint256)",
  
  "function createAsset(string cid, string title, string description, string contentType, string fileSize, uint256 price, uint256 maxSupply, uint256 royaltyBps) payable returns (address tokenContract)",
  "function purchase(string cid, uint256 quantity) payable",
  "function updateMetadata(string cid, string title, string description)",
];

export interface EvmRegistryConfig {
  rpcUrl: string;
  registryAddress: string;
  abi?: string[];
}

export class EvmAssetRegistry implements IAssetRegistry {
  private provider: providers.JsonRpcProvider;
  private contract: Contract | null = null;
  private signer: Signer | null = null;
  private chainId: number = 0;
  private readonly config: EvmRegistryConfig;
  private readonly abi: string[];
  private readonly iface: utils.Interface;

  constructor(config: EvmRegistryConfig) {
    this.config = config;
    this.abi = config.abi ?? REGISTRY_ABI;
    this.iface = new utils.Interface(this.abi);
    this.provider = new providers.JsonRpcProvider(config.rpcUrl);
  }

  async connect(signer: Signer): Promise<void> {
    this.signer = signer;
    this.contract = new Contract(
      this.config.registryAddress,
      this.abi,
      signer
    );
    
    const network = await this.provider.getNetwork();
    this.chainId = network.chainId;
  }

  async disconnect(): Promise<void> {
    this.signer = null;
    this.contract = null;
  }

  isConnected(): boolean {
    return this.signer !== null && this.contract !== null;
  }

  getChainId(): string {
    // return this.chainId;
    // TODO: add multichain support
    return "ethereum"
  }

  async getSignerAddress(): Promise<string> {
    this.ensureConnected();
    return this.signer!.getAddress();
  }

  async getAsset(cid: string): Promise<AssetData | null> {
    this.ensureConnected();
    
    try {
      const raw = await this.contract!.getAsset(cid);
      if (!raw.exists) return null;
      return this.mapToAssetData(raw);
    } catch (err) {
      if (this.isRevertError(err)) return null;
      throw err;
    }
  }

  async getAssets(query?: AssetQuery): Promise<AssetData[]> {
    this.ensureConnected();
    
    const limit = query?.limit ?? 100;
    const offset = query?.offset ?? 0;
    
    const rawAssets = await this.contract!.getAssets(limit, offset);
    let assets = rawAssets
      .filter((r: any) => r.exists)
      .map((r: any) => this.mapToAssetData(r));
    
    if (query?.creator) {
      const creatorLower = query.creator.toLowerCase();
      assets = assets.filter(
        (a: AssetData) => a.creator.address.toLowerCase() === creatorLower
      );
    }
    
    if (query?.contentType) {
      assets = assets.filter((a: AssetData) => a.contentType === query.contentType);
    }
    
    return assets;
  }

  async getAssetsByCreator(creator: string): Promise<AssetData[]> {
    this.ensureConnected();
    
    const rawAssets = await this.contract!.getAssetsByCreator(creator);
    return rawAssets
      .filter((r: any) => r.exists)
      .map((r: any) => this.mapToAssetData(r));
  }

  async getAssetCount(): Promise<number> {
    this.ensureConnected();
    const count: BigNumber = await this.contract!.getAssetCount();
    return count.toNumber();
  }

  async hasAccess(cid: string, address: string): Promise<boolean> {
    this.ensureConnected();
    return this.contract!.hasAccess(cid, address);
  }

  async getAccessTokenBalance(cid: string, address: string): Promise<bigint> {
    this.ensureConnected();
    const balance: BigNumber = await this.contract!.getAccessTokenBalance(cid, address);
    return balance.toBigInt();
  }

  async createAsset(params: CreateAssetParams): Promise<TxResult> {
    this.ensureConnected();
    
    const royaltyBps = Math.floor(params.royalty * 10000);
    const maxSupply = params.maxSupply ?? 0;
    
    try {
      const tx: ContractTransaction = await this.contract!.createAsset(
        params.cid,
        params.title,
        params.description,
        params.contentType,
        params.fileSize,
        params.price,
        maxSupply,
        royaltyBps
      );
      
      return this.waitForTransaction(tx);
    } catch (err) {
      return this.handleTransactionError(err);
    }
  }

  async purchaseAccess(cid: string, quantity: number = 1): Promise<TxResult> {
    this.ensureConnected();
    
    const asset = await this.getAsset(cid);
    if (!asset) {
      return { hash: '', success: false, error: 'Asset not found' };
    }
    
    const totalPrice = BigNumber.from(asset.price).mul(quantity);
    
    try {
      const tx: ContractTransaction = await this.contract!.purchase(
        cid, 
        quantity, 
        { value: totalPrice }
      );
      
      return this.waitForTransaction(tx);
    } catch (err) {
      return this.handleTransactionError(err);
    }
  }

  async updateAssetMetadata(
    cid: string, 
    title: string, 
    description: string
  ): Promise<TxResult> {
    this.ensureConnected();
    
    try {
      const tx: ContractTransaction = await this.contract!.updateMetadata(
        cid, 
        title, 
        description
      );
      return this.waitForTransaction(tx);
    } catch (err) {
      return this.handleTransactionError(err);
    }
  }

  async estimateGas(method: string, ...args: unknown[]): Promise<bigint> {
    this.ensureConnected();
    
    const estimate: BigNumber = await this.contract!.estimateGas[method](...args);
    // Add 20% buffer
    return estimate.mul(120).div(100).toBigInt();
  }

  private ensureConnected(): void {
    if (!this.contract || !this.signer) {
      throw new Error('Registry not connected. Call connect() first.');
    }
  }

  private async waitForTransaction(tx: ContractTransaction): Promise<TxResult> {
    const receipt: ContractReceipt = await tx.wait();
    
    return {
      hash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      success: receipt.status === 1,
      events: this.parseEvents(receipt),
    };
  }

  private parseEvents(receipt: ContractReceipt): ParsedEvent[] {
    const events: ParsedEvent[] = [];
    
    for (const log of receipt.logs) {
      try {
        const parsed = this.iface.parseLog(log);
        
        if (parsed) {
          const args: Record<string, unknown> = {};
          parsed.eventFragment.inputs.forEach((input, i) => {
            args[input.name] = parsed.args[i];
          });
          events.push({ name: parsed.name, args });
        }
      } catch {
        // Not one of our events
      }
    }
    
    return events;
  }

  private handleTransactionError(err: unknown): TxResult {
    const error = err as Record<string, any>;
    
    let message = error.message ?? 'Unknown error';
    
    if (error.reason) {
      message = error.reason;
    } else if (error.data?.message) {
      message = error.data.message;
    } else if (error.error?.message) {
      message = error.error.message;
    }

    // Try to decode custom error
    if (error.data && typeof error.data === 'string' && error.data !== '0x') {
      try {
        const decoded = this.iface.parseError(error.data);
        if (decoded) {
          message = `${decoded.name}(${decoded.args.join(', ')})`;
        }
      } catch {
        // Couldn't decode
      }
    }
    
    return {
      hash: error.transactionHash ?? '',
      success: false,
      error: message,
    };
  }

  private isRevertError(err: unknown): boolean {
    const error = err as Record<string, any>;
    return (
      error.code === 'CALL_EXCEPTION' ||
      error.code === 'UNPREDICTABLE_GAS_LIMIT' ||
      error.message?.includes('revert')
    );
  }

  private mapToAssetData(raw: any): AssetData {
    return {
      cid: raw.cid,
      title: raw.title,
      description: raw.description,
      type: this.inferType(raw.contentType),
      fileSize: raw.fileSize,
      contractAddress: raw.tokenContract,
      contentType: raw.contentType,
      createdAt: new Date(BigNumber.from(raw.createdAt).toNumber() * 1000).toISOString(),
      price: BigNumber.from(raw.price).toBigInt(),
      minted: BigNumber.from(raw.minted).toNumber(),
      maxSupply: BigNumber.from(raw.maxSupply).isZero() ? null : BigNumber.from(raw.maxSupply).toNumber(),
      royalty: BigNumber.from(raw.royaltyBps).toNumber() / 10000,
      creator: {
        address: raw.creator,
      },
    };
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