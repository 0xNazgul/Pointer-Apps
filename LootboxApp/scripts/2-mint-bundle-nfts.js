import { readFileSync } from 'fs';
import { sdk } from './helpers.js';

async function main() {
    // Paste in the address from when you created the bundle collection module
  	const bundleModuleAddress = '';
  	const bundleModule = sdk.getBundleModule(bundleModuleAddress);

  	console.log('Creating NFT batch...');

  	const created = await bundleModule.createAndMintBatch([
    	{
      		metadata: {
        		name: 'Frodo',
        		description: 'A Hobbit',
        		image: readFileSync('./assets/frodo.jpeg'),
        		properties: {
          			rarity: 'rare',
          			Power: 8,
        		}
      		},
      		supply: 25,
    	},
    	{
      		metadata: {
        		name: 'Sam',
        		description: 'Another Hobbit!',
        		image: readFileSync('./assets/sam.jpeg'),
        		properties: {
          			rarity: 'a bit rare',
          			Power: 5,
        		}
      		},
      		supply: 50,
    	},
    	{
      		metadata: {
        		name: 'Gandalf',
        		description: 'A wizard!',
        		image: readFileSync('./assets/gandalf.jpeg'),
        		properties: {
          			rarity: 'super rare!',
          			Magic: 10,
        		}
      		},
      		supply: 10,
    	}
  	]);

  	console.log('NFTs created!')
  	console.log(JSON.stringify(created, null, 2));
}

try {
  	await main();
} catch (error) {
  	console.error("Error minting the NFTs", error);
  	process.exit(1);
}