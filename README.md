
#  Warpcast Token Tipper
Warpcast utility script to save cast commenters and send tokens

- Install deps

```
npm install
```
- Add sensitive info in env vars
- 

```
# .env
# Signer
PKEY=<wallet private key>
```
- Add in config.json

All non-sensitive data should is added to the config.json like the token address, default output file name, api endpoints and etc.


##  How to use

###  Save Commenters details from a Cast
By default ignores the cast author.
```
npm run saveReplies -- --url=<url> --outputFilename=<path_to_save_replies_to.csv>
```
`--outputFilename` file defaults to the `castReplies.csv` if none supplied, check the `config.json` for the default file name.

example:
 `npm run saveReplies -- --url=https://warpcast.com/yes2crypto.eth/0x84b3953d --outputFilename=saveCommenters.csv`

###  Send Tokens
Send tokens to the address in the csv file, supports any ERC20 token just update the token 'address' in the config.json
```
npm run sendTokens <amount> -- --csv-file=<path_to_csv> ---sent-receipts=<path_to_sent_receipts_to.csv>
```
`--csv-file` defaults to `castReplies.csv` if none is supplied.
`--sent-receipts` save sent txns with the recepients, defaults to `sentReceipts.csv` if none is supplied.

example:
`npm run sendTokens -- --amount=200 --csv-file=saveCommenters.csv --outputFilename=sentReceipts.csv`

### Ignore FIDS
In the `config.json` you can add FIDS to ignore

example: This ignore `degentipbot`
```
"ignoreFid":  [
	"244128" 
]
```