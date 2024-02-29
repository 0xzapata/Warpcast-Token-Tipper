import { ethers } from "ethers"
import { formatUnits, parseUnits } from "ethers/utils"

/**
 * Represents an ERC20 token and provides methods to interact with it.
 */
export default class Token {
  /**
   * Creates a new Token instance.
   * @param {Object} evmClientInstance - The EVM client instance.
   * @param {string} tokenAddress - The address of the ERC20 token.
   * @param {Array} abi - The ABI of the ERC20 token.
   */
  constructor(evmClientInstance, tokenAddress, abi) {
    if (!tokenAddress) {
      throw new Error("Token address must be provided")
    }

    this.evmClient = evmClientInstance
    this.tokenAddress = tokenAddress
    this.erc20Contract = new ethers.Contract(tokenAddress, abi, this.evmClient.signer)
    this.decimals = 18
  }

  /**
   * Sends a specified amount of the token to a given address.
   * @param {string} address - The recipient's address.
   * @param {number} amount - The amount of tokens to send.
   * @returns {Promise<string>} - The transaction hash of the sent tokens.
   */
  async send(address, amount) {
    
    if (amount > 0) {
      throw new Error("Amount must not be 0 or negative")
    }

    try {
      const txResponse = await this.erc20Contract.transfer(address, parseUnits(amount.toString(), this.decimals))
      console.log(txResponse)
      return (
        await this.evmClient.signer.provider.waitForTransaction(txResponse.hash)
      ).hash
    } catch (err) {
        console.error(`Transfer failed: ${err}`)
        throw err
    }
  }

  /**
   * Retrieves the balance of the token for a given address.
   * @param {string} address - The address to check the balance for.
   * @returns {Promise<string>} - The balance of the token for the given address.
   */
  async balance(address) {
    try {
      const balanceBigInt = await this.erc20Contract.balanceOf(address)
      return formatUnits(balanceBigInt.toString(), this.decimals)
    } catch (err) {
      console.error(`Balance query failed: ${err}`)
      throw err
    }
  }

  /**
   * Retrieves the symbol of the token.
   * @returns {Promise<string>} - The symbol of the token.
   */
  async symbol() {
    try {
      return await this.erc20Contract.symbol()
    } catch (err) {
      console.error(`Balance query failed: ${err}`)
      throw err
    }
  }
}