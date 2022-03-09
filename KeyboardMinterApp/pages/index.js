import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { UserCircleIcon } from "@heroicons/react/solid";
import { toast } from "react-hot-toast"

import PrimaryButton from "../components/primary-button";
import Keyboard from "../components/keyboard";
import TipButton from "../components/tip-button";

import { useMetaMaskAccount } from "../components/meta-mask-account-provider";
import addressesEqual from "../utils/addressesEqual";
import getKeyboardsContract from "../utils/getKeyboardsContract"

export default function Home() {
	const { ethereum, connectedAccount, connectAccount } = useMetaMaskAccount();
	const keyboardsContract = getKeyboardsContract(ethereum);

	const [keyboards, setKeyboards] = useState([])
	const [keyboardsLoading, setKeyboardsLoading] = useState(false);

	const getKeyboards = async () => {
		if (ethereum && connectedAccount) {
			setKeyboardsLoading(true);
			try {
				const keyboards = await keyboardsContract.getKeyboards();
				console.log('Retrieved keyboards...', keyboards)
	
		  		setKeyboards(keyboards)
			} finally {
				setKeyboardsLoading(false);
			}
		}
	}
	// eslint-disable-next-line 
	useEffect(() => getKeyboards(), [!!keyboardsContract, connectedAccount])

	const addContractEventHandlers = () => {
		if (keyboardsContract && connectedAccount) {
		  keyboardsContract.on('KeyboardCreated', async (keyboard) => {
			if (connectedAccount && !addressesEqual(keyboard.owner, connectedAccount)) {
			  toast('Somebody created a new keyboard!', { id: JSON.stringify(keyboard) })
			}
			await getKeyboards();
		  })

		  keyboardsContract.on('TipSent', (recipient, amount) => {
			  if (addressesEqual(recipient, connectedAccount)) {
				  toast(`You received a tip of ${ethers.utils.formatEther(amount)} eth!`, {id:recipient + amount });
			  }
		  })
		}
	  }
	  // eslint-disable-next-line 
	  useEffect(addContractEventHandlers, [!!keyboardsContract, connectedAccount]);

  	if (!ethereum) {
    	return <p>Please install MetaMask to connect to this site</p>
	}

  	if (!connectedAccount) {
    	return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>
  	}

	if (keyboards.length > 0) {
		return (
		  	<div className="flex flex-col gap-4">
				<PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
			  		{keyboards.map(
						([kind, isPBT, filter, owner], i) => (
							<div key={i} className="relative">
								<Keyboard key={i} kind={kind} isPBT={isPBT} filter={filter} />
								<span className="absolute top-1 right-6">
									{addressesEqual(owner, connectedAccount) ?
										<UserCircleIcon className="h-5 w-5 text-Indigo-100" /> :
										<TipButton keyboardsContract={keyboardsContract} index={i} />
									}
								</span>
							</div>
						)
			  		)}
				</div>
		  	</div>
		)
	}

	if (keyboardsLoading) {
		return (
			<div className="flex flex-col gap-4">
			<PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
			<div className="flex space-x-4 animate-pulse">
				<div className="flex-1 space-y-4 py-1">
					  <div className="h-2 bg-indigo-100 rounded"></div>
						<div className="grid grid-cols-4 gap-2">
							  <div className="h-20 bg-indigo-100 rounded col-span-2"></div>
							  <div className="h-20 bg-indigo-100 rounded col-span-2"></div>
							  <div className="h-20 bg-indigo-100 rounded col-span-2"></div>
							  <div className="h-20 bg-indigo-100 rounded col-span-2"></div>
							  <div className="h-20 bg-indigo-100 rounded col-span-2"></div>
							  <div className="h-20 bg-indigo-100 rounded col-span-2"></div>
						</div>
						<div className="h-2 bg-indigo-100 rounded"></div>
				</div>
			  </div>
		  </div>
		)
	}
	
	return (
		<div className="flex flex-col gap-4">
		  	<PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
		  	<p>No keyboards yet!</p>
		</div>
	)
}