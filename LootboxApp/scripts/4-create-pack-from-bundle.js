import { readFileSync } from 'fs';
import { sdk } from './helpers.js';

async function main() {
    // Paste in the bundle module address here
    const bundleModuleAddress = ''; 
    const bundleModule = sdk.getBundleModule(bundleModuleAddress);

    // Paste in the pack module address here
    const packModuleAddress = ''; 
    const packModule = sdk.getPackModule(packModuleAddress);

    console.log('Getting all NFTs from bundle...');
    const nftsInBundle = await bundleModule.getAll();

    console.log('NFTs in bundle:');
    console.log(nftsInBundle);

    console.log('Creating a pack containing the NFTs from bundle...');
    const created = await packModule.create({
        assetContract: bundleModuleAddress,
        metadata: {
            name: 'Lord of The Rings PACK!',
            image: readFileSync('./assets/lotr.jpeg'),
        },
        assets: nftsInBundle.map(nft => ({
            tokenId: nft.metadata.id,
            amount: nft.supply,
        })),
    });

    console.log('Pack created!')
    console.log(created);
}

try {
    await main();
} catch (error) {
    console.error("Error minting the NFTs", error);
    process.exit(1);
}