import axios from 'axios'
import fs from 'fs'


const AXIOS_TIMEOUT = 10000

/**
 * Makes an API request using axios.
 * @param {Object} options - The request options.
 * @returns {Promise<any>} - The response data.
 */
export const apiRequest = async ({ endpoint, method="GET", headers }) => {
  return axios({
      method: method,
      timeout: AXIOS_TIMEOUT,
      url: endpoint,
      headers: headers,
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error("Error during API request:", error)
      return null
    })
}

/**
 * Converts a JSON object to a CSV file and writes it to the specified path.
 * @param {Object[]} jsonObj - The JSON object to convert.
 * @param {string} outputPath - The path to write the CSV file to.
 */
export const jsonToCsv = (jsonObj, outputPath) => {
  const csvData = []

  const headers = Object.keys(jsonObj[0])
  csvData.push(headers.join(','))

  jsonObj.forEach(item => {
    const values = headers.map(header => {
      return item[header]
    })
    csvData.push(values.join(','))
  })

  fs.writeFileSync(outputPath, csvData.join('\n'), 'utf8')

  console.log('CSV file successfully created at ' + outputPath)
}

/**
 * Parses a JSON file and returns the parsed data.
 * @param {string} filePath - The path to the JSON file.
 * @returns {Object} - The parsed JSON data.
 */
export const parseJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error(`Error reading JSON file: ${err}`)
    return null
  }
}