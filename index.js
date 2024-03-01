import yargs from 'yargs';
import tipReplies from "./tipRepliesUsingCsv.js"
import saveReplies from "./saveRepliesToCsv.js"

// Parse command line arguments
const argv = yargs(process.argv.slice(2))
    // Define the 'SAVE_REPLIES' command
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
    // Define the 'TIP_REPLIES' command
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
    // Display help message
    .help()
    .argv;

// Get the command from the arguments and convert it to uppercase
const command = argv._[0].toUpperCase();

// Execute the appropriate function based on the command
if (command === 'SAVE_REPLIES') {
    saveReplies(argv.url, argv.outputFilename);
} else if (command === 'TIP_REPLIES') {
    tipReplies(argv.amount, argv.csvFile, argv.sentReceipts);
} else {
    // If the command is not recognized, display an error message and exit
    console.error('Invalid argument. Please provide either SAVE_REPLIES or TIP_REPLIES');
    process.exit(1);
}