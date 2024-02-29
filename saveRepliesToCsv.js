import Farcaster from './lib/Farcaster.js'
import { jsonToCsv, parseJsonFile } from './lib/Utils.js'

/**
 * Parses the username and short hash from a given URL.
 * @param {string} url - The URL to parse.
 * @returns {object} An object containing the username and short hash.
 */
const parseCastUrl = (url) => {
  const regex = /https:\/\/warpcast.com\/([^\/]+)\/([^\/]+)/
  const matches = url.match(regex)
  const username = matches[1]
  const shortHash = matches[2]

  return { username, shortHash }
}

/**
 * Saves replies to a CSV file.
 * @param {string} url - The URL to save replies from.
 * @param {string} [filePath] - The path to the CSV file to save the replies to. If not provided, it defaults to the value in the config file.
 * @throws {Error} If the URL is not provided.
 */
export const saveRepliesToCsv = async (url, filePath=undefined) => {

  const config = parseJsonFile('./config.json')

  if (!url) {
    throw new Error('URL is required')
  }
  
  const fc = new Farcaster(config)
  
  // if no filePath is passed, defaults to DEFAULT_CSV_FILEPATH
  const outputFile = filePath || config.defaultCsvOutputName
  const { username, shortHash } = parseCastUrl(url)
  
  const { threadHash, author } = await fc.getShortCast(shortHash, username)

  const castReplies = await fc.getCastThread(threadHash)
    
  const filteredCastReplies = castReplies.filter((reply) => {
    return reply.hash !== threadHash && reply.author.fid !== author.fid && !fc.ignoreList.includes(reply.author.fid)
    })
    .map(({ text, author: { custodyAddress, connectedAddress, displayName, fid }, hash }) => {
      return {
        hash,
        address: connectedAddress ? connectedAddress : custodyAddress,
        isCustodyAddress: connectedAddress ? 'false' : 'true',
        fid,
        displayName,
        text: text.replace(/[\n\r]/g, ' ') // replace new lines with spaces
      }
    })

  console.log(filteredCastReplies)

  jsonToCsv(filteredCastReplies, outputFile)
}

export default saveRepliesToCsv