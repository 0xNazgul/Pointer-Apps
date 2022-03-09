import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";

import dotenv from "dotenv";
dotenv.config();

const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;

if (!walletPrivateKey) {
    console.error("Wallet private key missing")
    process.exit(1)
}

export const sdk = new ThirdwebSDK(
    new ethers.Wallet(
        process.env.WALLET_PRIVATE_KEY,
        ethers.getDefaultProvider("https://polygon-mumbai.g.alchemy.com/v2/cIRSgz9Mj4j4jTBotP9e2fjhPpb2yz_A")
    ),
);
// Paste in the project address from thirdweb here
const appAddress = '' 

export async function getApp() {
    const app = await sdk.getAppModule(appAddress);
    return app;
}