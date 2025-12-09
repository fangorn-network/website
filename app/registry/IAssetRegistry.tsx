// registry.interface.ts
import { AssetData, CreateAssetParams, AssetQuery, TxResult } from "../common/types"

export interface IAssetRegistry {
  // Queries
  getAsset(cid: string): Promise<AssetData | null>;
  getAssets(query?: AssetQuery): Promise<AssetData[]>;
  getAssetsByCreator(creator: string): Promise<AssetData[]>;
  
  // Check access (does address hold the token?)
  hasAccess(cid: string, address: string): Promise<boolean>;
  
  // Mutations
  createAsset(params: CreateAssetParams): Promise<TxResult>;
  purchaseAccess(cid: string): Promise<TxResult>;
  
  // Lifecycle
  connect(signer: unknown): Promise<void>;
  disconnect(): Promise<void>;
  
  // Utility
  getChainId(): string;
  isConnected(): boolean;
}