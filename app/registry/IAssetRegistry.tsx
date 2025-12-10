// registry.interface.ts
import { AssetData, CreateAssetParams, AssetQuery, TxResult } from "../common/types"

export interface IAssetRegistry {
  // Queries
  getAsset(cid: string): Promise<AssetData | null>;
  getAssetsByCreator(reator: string): Promise<AssetData[]>;
  
  // Check access (does address hold the token?)
  hasAccess(cid: string, address: string): Promise<boolean>;
  
  // Mutations
  // create a new space
  createSpace(address: string, name: string): Promise<null>;
  // register a new asset
  createAsset(params: CreateAssetParams): Promise<TxResult>;
  // purchase access based on CID
  purchaseAccess(cid: string): Promise<TxResult>;
  
  // Lifecycle
  connect(signer: unknown): Promise<void>;
  disconnect(): Promise<void>;
  
  // Utility
  getChainId(): string;
  isConnected(): boolean;
}

// TODO:
// updateAsset?
// delete or remove Asset?