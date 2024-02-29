import yargs from 'yargs';
import tipReplies from "./tipRepliesUsingCsv.js"
import saveReplies from "./saveRepliesToCsv.js"

const argv = yargs(process.argv.slice(2))
    .command('SAVE_REPLIES', 'Save replies', {
        url: {
            description: 'The URL to save replies to',
            demandOption: true,
            type: 'string'
        },
        outputFilename: {
            description: 'The filename to save the replies to',
            demandOption: false,
            type: 'string',
            default: undefined
        }
    })
    .command('TIP_REPLIES', 'Tip replies', {
        amount: {
            description: 'The amount of token to send to each recipient',
            demandOption: true,
            type: 'number'
        },
        csvFile: {
            description: 'The path to the CSV file to load',
            demandOption: false,
            type: 'string',
            default: undefined
        },
        sentReceipts: {
            description: 'The path to the sent txns CSV file',
            demandOption: false,
            type: 'string',
            default: undefined
        }
    })
    .help()
    .argv;

const command = argv._[0].toUpperCase();

if (command === 'SAVE_REPLIES') {
    saveReplies(argv.url, argv.outputFilename);

} else if (command === 'TIP_REPLIES') {
    tipReplies(argv.amount, argv.csvFile, argv.sentReceipts);
} else {
    console.error('Invalid argument. Please provide either SAVE_REPLIES or TIP_REPLIES');
    process.exit(1);
}