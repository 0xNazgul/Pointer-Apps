import { sdk } from "./helpers.js";

async function main() {
    // Paste in the pack module address
    const packModuleAddress = ''; 
    const packModule = sdk.getPackModule(packModuleAddress);

    console.log('Opening the pack...');
    const opened = await packModule.open('0');
    console.log('Opened the pack!');
    console.log(opened);
}

try {
    await main();
} catch (error) {
    console.error("Error opening the pack", error);
    process.exit(1);
}