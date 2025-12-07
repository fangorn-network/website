import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { encryptString } from '@lit-protocol/encryption';

type LitNodeClientType = LitJsSdk.LitNodeClientNodeJs | LitJsSdk.LitNodeClient;

// we can support multiple chains 
export type LitChain = "ethereum" | "polygon" | "solana" | string;

class Lit {
  public litNodeClient: LitNodeClientType | undefined;
  public chain: LitChain;

  constructor(chain: LitChain) {
    this.chain = chain;
  }

  async connect(): Promise<void> {
    const client = new LitJsSdk.LitNodeClient({
      alertWhenUnauthorized: false,
      litNetwork: 'datil-dev',
      debug: true,
    });

    this.litNodeClient = client;
    await this.litNodeClient.connect();

    console.log("Lit connected on network:", client.config.litNetwork);
  }

  /**
   * Encrypts a string message using the defined Access Control Conditions.
   * @param message The string to encrypt.
   * @returns An object containing the ciphertext and dataToEncryptHash.
   */
  async encrypt(message: string, accessControlConditions: any): Promise<{ ciphertext: string, dataToEncryptHash: string }> {
    if (!this.litNodeClient) {
      throw new Error("Lit Node Client is not connected. Call .connect() first.");
    }

    // const accessControlConditions = [
    //   {
    //     contractAddress: "",
    //     standardContractType: "",
    //     chain: "ethereum",
    //     method: "eth_getBalance",
    //     parameters: [":userAddress", "latest"],
    //     returnValueTest: {
    //       comparator: ">=",
    //       value: "1000000000000", // 0.000001 ETH
    //     },
    //   },
    // ];
    // Encrypt the message
    // LitJsSdk.encryptString returns an object with the two properties.
    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions,
        dataToEncrypt: message,
      },
      this.litNodeClient,
    );

    // Return the ciphertext and dataToEncryptHash
    return {
      ciphertext,
      dataToEncryptHash,
    };
  }

  public getClient(): LitNodeClientType | undefined {
    return this.litNodeClient;
  }
}

export default Lit;