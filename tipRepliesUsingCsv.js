import fs from 'fs'
import csv from 'csv-parser'
import chalk from 'chalk';
import dotenv from 'dotenv';
import Token from "./lib/Token.js"
import Client from "./lib/Client.js"
import { parseJsonFile, jsonToCsv } from './lib/Utils.js';

dotenv.config();
const log = console.log;

const config = parseJsonFile('./config.json')
if (!config) {
  throw new Error("Config is null");
}

const PKEY = process.env["PKEY"]

const DEFAULT_CSV_FILEPATH = config.defaultCsvOutputName
const RPC_URL = config.chain.rpcUrl
const BASE_CHAIN = {
  id: parseInt(config.chain.id),
  name: config.chain.name,
  explorer: config.chain.explorer
}
const TOKEN_ADDRESS = config.token.address
const ABI = [
  "function balanceOf(address addr) view returns (uint)",
  "function transfer(address to, uint amount)",
  "function symbol() view returns (string)",
]

const baseClient = new Client(PKEY, BASE_CHAIN, RPC_URL)
const tokenAddress = new Token(baseClient, TOKEN_ADDRESS, ABI)

/**
 * Sends a token to a given address.
 * @param {string} address - The address to send the token to.
 * @param {number} amountToSend - The amount of token to send.
 * @returns {string} The transaction hash of the sent token.
 * @throws {Error} If there is not enough token balance to send.
 */
const sendToken = async(address, amountToSend) => {
  const tokenBalance = await tokenAddress.balance(baseClient.signer.address)

  if (amountToSend > tokenBalance)  {
    throw new Error("Not enough token balance to send")
  }

  try {
    const minedTxHash = await tokenAddress.send(address, amountToSend);
    log(`${chalk.green(amountToSend)} $DEGEN sent to ${chalk.yellow(address)} with txHash:\n` +
      chalk.blue(`${BASE_CHAIN.explorer}/tx/${minedTxHash}`)
    );
    return minedTxHash;
  } catch (e) {
    log(e);
    throw e;
  }
}

/**
 * Saves transaction receipts to a CSV file.
 * @param {object[]} receipts - The transaction receipts to save.
 * @param {string} [filePath="sentTxns.csv"] - The path to the CSV file to save the receipts to. If not provided, it defaults to "sentTxns.csv".
 * @throws {Error} If there is an error while saving the receipts.
 */
const saveTxReceiptsToCsv = async (receipts, filePath="sentTxns.csv") => {
    try {
      jsonToCsv(receipts, filePath)
    } catch (err) {
      reject(err);
    }
}

/**
 * Sends a fixed amount of token to each recipient in a list.
 * @param {object[]} recipients - The list of recipients to send the token to.
 * @param {number} amountToSend - The amount of token to send to each recipient.
 * @returns {object[]} The transaction receipts for each sent token.
 * @throws {Error} If there is an error while sending the token.
 */
const batchSendFixedAmount = async (recipients, amountToSend) => {
  const sentTxHashes = []

  try {
    for (const recipient of recipients) {
      const minedTxHash = BASE_CHAIN.explorer + '/tx/' + await sendToken(recipient.address, amountToSend);
      sentTxHashes.push({ 
        txnUrl: minedTxHash,
        address: recipient.address,
        displayName: recipient.displayName,
        amountToSent: amountToSend });
    }
    return sentTxHashes;
  } catch (e) {
    log(e);
    throw e;
  }
}

/**
 * Loads recipients from a CSV file.
 * @param {string} [filePath=undefined] - The path to the CSV file to load the recipients from. If not provided, it defaults to the value in the config file.
 * @returns {Promise} A promise that resolves with the loaded recipients.
 * @throws {Error} If the file cannot be found or there is an error while loading the recipients.
 */
const loadRecipientsFromCsv = async (filePath=undefined) => {

  if(!filePath) {
    filePath = DEFAULT_CSV_FILEPATH
    log(`Loading default CSV file: ${DEFAULT_CSV_FILEPATH}`)
  } else {
    log(`Loading CSV file: ${filePath}`)
  }

  const recipients = []

  return new Promise((resolve, reject) => {
    try {
      // Check if the file exists before creating the stream
      fs.accessSync(filePath, fs.F_OK)

      fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => {
            const { hash, address, isCustodyAddress, fid, displayName, text } = data
            recipients.push({ hash, address, isCustodyAddress, fid, displayName, text })
          })
          .on('end', () => {
            resolve(recipients)
          })
          .on('error', (error) => {
            reject(new Error(`Cannot find file '${filePath}', make sure it's generated.\nError: ${error}`))
          })

    } catch (err) {
      log(chalk.red(`ERROR: Cannot find file '${filePath}', make sure csv file is generated.`));
      reject(err);
    }
  })

}

/**
 * Tips replies using a CSV file.
 * @param {number} amount - The amount of token to send to each recipient.
 * @param {string} [filePath=undefined] - The path to the CSV file to load the recipients from. If not provided, it defaults to the value in the config file.
 * @param {string} [sentReceiptsFilePath=undefined] - The path to the CSV file to save the transaction receipts to. If not provided, it defaults to "sentTxns.csv".
 * @throws {Error} If there is an error while tipping the replies.
 */
export const tipRepliesUsingCsv = async (amount, filePath=undefined, sentReceiptsFilePath=undefined) => {
  log(`Connecting on RPC: ${RPC_URL}`)
  log("Signer Address:" + chalk.green(baseClient.signer.address))
  log(`Getting token address of \n${await tokenAddress.symbol()}: ${TOKEN_ADDRESS}`)
  log(`Signer balance: ${await tokenAddress.balance(baseClient.signer.address)} ${await tokenAddress.symbol()}`)

  try {
    const recipients = await loadRecipientsFromCsv(filePath);
    log(recipients);

    const receipts = await batchSendFixedAmount(recipients, amount);

    saveTxReceiptsToCsv(receipts, sentReceiptsFilePath)

    log(receipts);
    
  } catch (e) {
    log(e);
  }

}

export default tipRepliesUsingCsv
