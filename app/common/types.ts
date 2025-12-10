
/**
 * The AssetData interface
 */
export interface AssetData {
    // the content identifier of the ciphertext
    cid: string;
    // a title
    title: string;
    // a brief description of the file contents
    description: string;
    // the filetype
    type: string;
    // filesize in mb
    fileSize: string;
    // the AccessToken contract
    contractAddress: string;
    // the content type (e.g. TXT, PDF, JPG)
    contentType: string;
    // the date when the asset was created
    createdAt: string;
    // the price of the token
    price: BigInt;
    // this value must be derived from price
    priceUsd?: number;
    // the number of tokens minted so far
    minted: number;
    // the max supply of tokens (null if unlimited)
    maxSupply: number | null;
    // the royalty percent (e.g. 0.05 = 5%)
    royalty: number;
    // creator details
    creator: {
        // the address of the creator
        address: string;
        // probably not needed rn?
        name?: string;
        // same as above
        avatar?: string;
    };
}

// What we need to create a new asset (contract-level params)
export interface CreateAssetParams {
  spaceName: string; 
  cid: string;
  title: string;
  description: string;
  contentType: string;
  fileSize: string;
  price: bigint; // native token units
  maxSupply: number | null;
  royalty: number; // basis points or percent depending on contract
}

// Query filters
export interface AssetQuery {
  creator?: string;
  contentType?: string;
  limit?: number;
  offset?: number;
}

// Normalized result type for mutations
export interface TxResult {
  hash: string;
  blockNumber?: number;
  success: boolean;
  error?: string;
  events?: ParsedEvent[];
}

export interface ParsedEvent {
  name: string;
  args: Record<string, unknown>;
}