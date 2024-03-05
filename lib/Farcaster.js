import { apiRequest, parseJsonFile } from "./Utils.js"

/**
 * Represents a Farcaster object.
 * @constructor
 * @param {Object} config - The configuration object.
 * @param {string[]} config.ignoreFid - The list of FIDs to ignore.
 * @param {Object} config.apiReqSettings - The API request settings.
 * @param {string} config.apiReqSettings.baseApiUrl - The base URL for the API.
 * @param {Object} config.apiReqSettings.header - The headers for the API request.
 */
export default class Farcaster {
  
  constructor(config){
    this.ignoreList = config.ignoreFid
    this.apiReqSettings = config.apiReqSettings
  }

  /**
   * Gets a user by their username.
   * @param {string} username - The username of the user to get.
   * @returns {Object} The user object.
   */
  async getUser(username) {
    const { result } = await apiRequest(
      endpoint=`${this.apiReqSettings.baseApiUrl}/user-by-username?username=${username}`,
      headers=this.apiReqSettings.header
    )
    return result.user
  }

  /**
   * Gets a short cast by cast hash and username.
   * @param {string} castHash - The hash of the cast.
   * @param {string} username - The username of the user.
   * @returns {Object} The short cast object.
   */
  async getShortCast(castHash, username) {
    
    const { result } = await apiRequest({
      endpoint: `${this.apiReqSettings.baseApiUrl}/cast-short?shortHash=${castHash}&username=${username}`,
      headers: this.apiReqSettings.header
    })

    return result.cast
  }

  /**
   * Gets a cast by cast hash.
   * @param {string} castHash - The hash of the cast.
   * @returns {Object} The cast object.
   */
  async getCast(castHash) {
    
    const { result } = await apiRequest({
      endpoint:`${this.apiReqSettings.baseApiUrl}/cast?hash=${castHash}`,
      headers:this.apiReqSettings.header
    })

    return result.cast
  }

  /**
   * Gets all casts in a thread by thread hash.
   * @param {string} castHash - The hash of the thread.
   * @returns {Object[]} An array of cast objects.
   */
  async getCastThread(castHash) {
    
    const { result } = await apiRequest({
      endpoint:`${this.apiReqSettings.baseApiUrl}/all-casts-in-thread?threadHash=${castHash}`,
      headers: this.apiReqSettings.header
    })    
    return result.casts
  }
}