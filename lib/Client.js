import { ethers } from "ethers"

/**
 * Represents an Ethereum client and provides methods to interact with it.
 */
export default class EvmClient {
  /**
   * Creates a new EvmClient instance.
   * @param {string} privateKey - The private key of the Ethereum client.
   * @param {Object} chain - The chain object containing the id and name of the chain.
   * @param {string} rpcUrl - The RPC URL of the Ethereum client.
   */
  constructor(privateKey, chain, rpcUrl) {
    this.privateKey = privateKey
    this.rpcUrl = rpcUrl ?? undefined
    this.chainId = chain.id
    this.chainName = chain.name
    this.provider = new ethers.JsonRpcProvider(
      this.rpcUrl,
      { chainId: this.chainId, name: this.chainName }
    )
    this.signer = new ethers.Wallet(this.privateKey).connect(this.provider)
  }
}
