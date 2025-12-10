// viem-registry.ts
import {
  createPublicClient,
  createWalletClient,
  http,
  PublicClient,
  WalletClient,
  Address,
  Hash,
  decodeEventLog,
  parseEventLogs,
  Log,
} from 'viem';
import type { Chain } from 'viem/chains';
import {
  AssetData,
  CreateAssetParams,
  AssetQuery,
  TxResult,
  ParsedEvent,
} from '../common/types';
import { IAssetRegistry } from './IAssetRegistry';

const REGISTRY_ABI = [
  {
    type: 'event',
    name: 'AssetCreated',
    inputs: [
      { name: 'cid', type: 'string', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'tokenContract', type: 'address', indexed: false },
      { name: 'price', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'AssetPurchased',
    inputs: [
      { name: 'cid', type: 'string', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'quantity', type: 'uint256', indexed: false },
      { name: 'totalPaid', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'AssetUpdated',
    inputs: [
      { name: 'cid', type: 'string', indexed: true },
      { name: 'title', type: 'string', indexed: false },
      { name: 'description', type: 'string', indexed: false },
    ],
  },
  {
    type: 'function',
    name: 'getAsset',
    stateMutability: 'view',
    inputs: [{ name: 'cid', type: 'string' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'cid', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'contentType', type: 'string' },
          { name: 'fileSize', type: 'string' },
          { name: 'tokenContract', type: 'address' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'price', type: 'uint256' },
          { name: 'minted', type: 'uint256' },
          { name: 'maxSupply', type: 'uint256' },
          { name: 'royaltyBps', type: 'uint256' },
          { name: 'creator', type: 'address' },
          { name: 'exists', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getAssets',
    stateMutability: 'view',
    inputs: [
      { name: 'limit', type: 'uint256' },
      { name: 'offset', type: 'uint256' },
    ],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'cid', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'contentType', type: 'string' },
          { name: 'fileSize', type: 'string' },
          { name: 'tokenContract', type: 'address' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'price', type: 'uint256' },
          { name: 'minted', type: 'uint256' },
          { name: 'maxSupply', type: 'uint256' },
          { name: 'royaltyBps', type: 'uint256' },
          { name: 'creator', type: 'address' },
          { name: 'exists', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getAssetsByCreator',
    stateMutability: 'view',
    inputs: [{ name: 'creator', type: 'address' }],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'cid', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'contentType', type: 'string' },
          { name: 'fileSize', type: 'string' },
          { name: 'tokenContract', type: 'address' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'price', type: 'uint256' },
          { name: 'minted', type: 'uint256' },
          { name: 'maxSupply', type: 'uint256' },
          { name: 'royaltyBps', type: 'uint256' },
          { name: 'creator', type: 'address' },
          { name: 'exists', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getAssetCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'hasAccess',
    stateMutability: 'view',
    inputs: [
      { name: 'cid', type: 'string' },
      { name: 'account', type: 'address' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'getAccessTokenBalance',
    stateMutability: 'view',
    inputs: [
      { name: 'cid', type: 'string' },
      { name: 'account', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'createAsset',
    stateMutability: 'payable',
    inputs: [
      { name: 'cid', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'contentType', type: 'string' },
      { name: 'fileSize', type: 'string' },
      { name: 'price', type: 'uint256' },
      { name: 'maxSupply', type: 'uint256' },
      { name: 'royaltyBps', type: 'uint256' },
    ],
    outputs: [{ type: 'address' }],
  },
  {
    type: 'function',
    name: 'purchase',
    stateMutability: 'payable',
    inputs: [
      { name: 'cid', type: 'string' },
      { name: 'quantity', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'updateMetadata',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'cid', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'description', type: 'string' },
    ],
    outputs: [],
  },
] as const;

type RawAsset = {
  cid: string;
  title: string;
  description: string;
  contentType: string;
  fileSize: string;
  tokenContract: Address;
  createdAt: bigint;
  price: bigint;
  minted: bigint;
  maxSupply: bigint;
  royaltyBps: bigint;
  creator: Address;
  exists: boolean;
};

export interface ViemRegistryConfig {
  chain: Chain;
  registryAddress: Address;
  rpcUrl?: string;
}

export class ViemAssetRegistry implements IAssetRegistry {
  private publicClient: PublicClient;
  private walletClient: WalletClient | null = null;
  private readonly config: ViemRegistryConfig;
  private readonly address: Address;

  constructor(config: ViemRegistryConfig) {
    this.config = config;
    this.address = config.registryAddress;
    this.publicClient = createPublicClient({
      chain: config.chain,
      transport: http(config.rpcUrl),
    });
  }

  async connect(walletClient: WalletClient): Promise<void> {
    this.walletClient = walletClient;
  }

  async disconnect(): Promise<void> {
    this.walletClient = null;
  }

  isConnected(): boolean {
    return this.walletClient !== null;
  }

  getChainId(): string {
    return this.config.chain.id.toString();
  }

  async getSignerAddress(): Promise<string> {
    this.ensureConnected();
    const [address] = await this.walletClient!.getAddresses();
    return address;
  }

  // --- Queries ---

  async getAsset(cid: string): Promise<AssetData | null> {
    try {
      const raw = await this.publicClient.readContract({
        address: this.address,
        abi: REGISTRY_ABI,
        functionName: 'getAsset',
        args: [cid],
      });

      if (!raw.exists) return null;
      return this.mapToAssetData(raw);
    } catch (err) {
      if (this.isRevertError(err)) return null;
      throw err;
    }
  }

  async getAssets(query?: AssetQuery): Promise<AssetData[]> {
    const limit = BigInt(query?.limit ?? 100);
    const offset = BigInt(query?.offset ?? 0);

    const rawAssets = await this.publicClient.readContract({
      address: this.address,
      abi: REGISTRY_ABI,
      functionName: 'getAssets',
      args: [limit, offset],
    });

    let assets = rawAssets
      .filter((r) => r.exists)
      .map((r) => this.mapToAssetData(r));

    if (query?.creator) {
      const creatorLower = query.creator.toLowerCase();
      assets = assets.filter(
        (a) => a.creator.address.toLowerCase() === creatorLower
      );
    }

    if (query?.contentType) {
      assets = assets.filter((a) => a.contentType === query.contentType);
    }

    return assets;
  }

  async getAssetsByCreator(creator: string): Promise<AssetData[]> {
    const rawAssets = await this.publicClient.readContract({
      address: this.address,
      abi: REGISTRY_ABI,
      functionName: 'getAssetsByCreator',
      args: [creator as Address],
    });

    return rawAssets
      .filter((r) => r.exists)
      .map((r) => this.mapToAssetData(r));
  }

  async getAssetCount(): Promise<number> {
    const count = await this.publicClient.readContract({
      address: this.address,
      abi: REGISTRY_ABI,
      functionName: 'getAssetCount',
    });

    return Number(count);
  }

  async hasAccess(cid: string, address: string): Promise<boolean> {
    return this.publicClient.readContract({
      address: this.address,
      abi: REGISTRY_ABI,
      functionName: 'hasAccess',
      args: [cid, address as Address],
    });
  }

  async getAccessTokenBalance(cid: string, address: string): Promise<bigint> {
    return this.publicClient.readContract({
      address: this.address,
      abi: REGISTRY_ABI,
      functionName: 'getAccessTokenBalance',
      args: [cid, address as Address],
    });
  }

  // --- Mutations ---

  async createAsset(params: CreateAssetParams): Promise<TxResult> {
    this.ensureConnected();

    const royaltyBps = BigInt(Math.floor(params.royalty * 10000));
    const maxSupply = BigInt(params.maxSupply ?? 0);
    const [account] = await this.walletClient!.getAddresses();

    try {
      const { request } = await this.publicClient.simulateContract({
        address: this.address,
        abi: REGISTRY_ABI,
        functionName: 'createAsset',
        args: [
          params.cid,
          params.title,
          params.description,
          params.contentType,
          params.fileSize,
          params.price,
          maxSupply,
          royaltyBps,
        ],
        account,
      });

      const hash = await this.walletClient!.writeContract(request);
      return this.waitForTransaction(hash);
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

    const totalPrice = asset.price as bigint * BigInt(quantity);
    const [account] = await this.walletClient!.getAddresses();

    try {
      const { request } = await this.publicClient.simulateContract({
        address: this.address,
        abi: REGISTRY_ABI,
        functionName: 'purchase',
        args: [cid, BigInt(quantity)],
        value: totalPrice,
        account,
      });

      const hash = await this.walletClient!.writeContract(request);
      return this.waitForTransaction(hash);
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

    const [account] = await this.walletClient!.getAddresses();

    try {
      const { request } = await this.publicClient.simulateContract({
        address: this.address,
        abi: REGISTRY_ABI,
        functionName: 'updateMetadata',
        args: [cid, title, description],
        account,
      });

      const hash = await this.walletClient!.writeContract(request);
      return this.waitForTransaction(hash);
    } catch (err) {
      return this.handleTransactionError(err);
    }
  }

  async estimateGas(method: string, ...args: unknown[]): Promise<bigint> {
    this.ensureConnected();

    const [account] = await this.walletClient!.getAddresses();

    const estimate = await this.publicClient.estimateContractGas({
      address: this.address,
      abi: REGISTRY_ABI,
      functionName: method as any,
      args: args as any,
      account,
    });

    // 20% buffer
    return (estimate * BigInt(120)) / BigInt(100);
  }

  // --- Private ---

  private ensureConnected(): void {
    if (!this.walletClient) {
      throw new Error('Registry not connected. Call connect() first.');
    }
  }

  private async waitForTransaction(hash: Hash): Promise<TxResult> {
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

    return {
      hash: receipt.transactionHash,
      blockNumber: Number(receipt.blockNumber),
      success: receipt.status === 'success',
      events: this.parseEvents(receipt.logs),
    };
  }

  private parseEvents(logs: Log[]): ParsedEvent[] {
    const events: ParsedEvent[] = [];

    for (const log of logs) {
      try {
        const decoded = decodeEventLog({
          abi: REGISTRY_ABI,
          data: log.data,
          topics: log.topics,
        });

        const args: Record<string, unknown> = {};
        if (decoded.args && typeof decoded.args === 'object') {
          for (const [key, value] of Object.entries(decoded.args)) {
            args[key] = value;
          }
        }

        events.push({ name: decoded.eventName, args });
      } catch {
        // Not one of our events
      }
    }

    return events;
  }

  private handleTransactionError(err: unknown): TxResult {
    const error = err as Record<string, any>;

    let message = error.message ?? 'Unknown error';

    // viem error structure
    if (error.shortMessage) {
      message = error.shortMessage;
    }

    if (error.cause?.reason) {
      message = error.cause.reason;
    }

    if (error.cause?.shortMessage) {
      message = error.cause.shortMessage;
    }

    return {
      hash: '',
      success: false,
      error: message,
    };
  }

  private isRevertError(err: unknown): boolean {
    const error = err as Record<string, any>;
    return (
      error.name === 'ContractFunctionExecutionError' ||
      error.message?.includes('revert') ||
      error.cause?.name === 'ContractFunctionRevertedError'
    );
  }

  private mapToAssetData(raw: RawAsset): AssetData {
    return {
      cid: raw.cid,
      title: raw.title,
      description: raw.description,
      type: this.inferType(raw.contentType),
      fileSize: raw.fileSize,
      contractAddress: raw.tokenContract,
      contentType: raw.contentType,
      createdAt: new Date(Number(raw.createdAt) * 1000).toISOString(),
      price: raw.price,
      minted: Number(raw.minted),
      maxSupply: raw.maxSupply === BigInt(0) ? null : Number(raw.maxSupply),
      royalty: Number(raw.royaltyBps) / 10000,
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