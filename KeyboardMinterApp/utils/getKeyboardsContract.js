import { ethers } from "ethers";

import abi from "./Keyboards.json"

const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = abi.abi;

export default function getKeyboardsContract(ethereum) {
    if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(contractAddress, contractABI, signer);
    } else {
    return undefined;
    }
}
