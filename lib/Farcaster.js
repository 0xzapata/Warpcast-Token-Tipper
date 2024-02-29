import { apiRequest, parseJsonFile } from "./Utils.js"

export default class Farcaster {
  
  constructor(config){


    this.ignoreList = config.ignoreFid
    this.apiReqSettings = config.apiReqSettings

  }

  async getUser(username) {
    const { result } = await apiRequest(
      endpoint=`${this.apiReqSettings.baseApiUrl}/user-by-username?username=${username}`,
      headers=this.apiReqSettings.header
    )
    return result.user
  }

  async getShortCast(castHash, username) {
    
    const { result } = await apiRequest({
      endpoint: `${this.apiReqSettings.baseApiUrl}/cast-short?shortHash=${castHash}&username=${username}`,
      headers: this.apiReqSettings.header
    })

    return result.cast
  }

  async getCast(castHash) {
    
    const { result } = await apiRequest({
      endpoint:`${this.apiReqSettings.baseApiUrl}/cast?hash=${castHash}`,
      headers:this.apiReqSettings.header
    })

    return result.cast
  }

  async getCastThread(castHash) {
    
    const { result } = await apiRequest({
      endpoint:`${this.apiReqSettings.baseApiUrl}/all-casts-in-thread?threadHash=${castHash}`,
      headers: this.apiReqSettings.header
    })    
    return result.casts
  }
}