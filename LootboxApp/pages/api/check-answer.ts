import quizQuestions from "../../lib/questions";
import { ethers, BigNumber } from "ethers"; 
import type { NextApiRequest, NextApiResponse } from "next";
import { packAddress } from "../../lib/contractAddresses";
import { ThirdwebSDK } from "@3rdweb/sdk";

export type CheckAnswerPayload = {
	questionIndex: number;
	answerIndex: number;
	message: string;
	signedMessage: string;
};

type ErrorResponse = {
	kind: "error";
	error: string;
};

type IncorrectResponse = {
	kind: "incorrect";
	correctAnswerIndex: number;
};

type CorrectResponse = {
  	kind: "correct";
};

export type CheckAnswerResponse =
	| ErrorResponse
	| IncorrectResponse
	| CorrectResponse;

export default async function Open(
	req: NextApiRequest,
	res: NextApiResponse<CheckAnswerResponse>
) {
  	if (!req.body.hasOwnProperty("questionIndex")) {
    	res.status(400).json({
      		kind: "error",
      		error: "No question index in request body",
    	});
    	return;
  	}

  	if (!req.body.hasOwnProperty("answerIndex")) {
    	res.status(400).json({
      		kind: "error",
      		error: "No answer index in request body",
    	});
    	return;
  	}

  	const body = req.body as CheckAnswerPayload;

  	let address = ""
  	try {
    	address = ethers.utils.verifyMessage(body.message, body.signedMessage)
  	} catch (err) {
    	res.status(400).json({
      		kind: "error",
      		error: `Unable to verify message: ${err}`,
    	});
    	return;
  	}

  	if (body.questionIndex >= quizQuestions.length) {
    	res.status(400).json({
      		kind: "error",
      		error: `Invalid question index ${body.questionIndex}`,
    	});
    	return;
  	}

  	const question = quizQuestions[body.questionIndex];

  	if (body.answerIndex !== question.correctAnswerIndex) {
    	res.status(200).json({
      		kind: "incorrect",
      		correctAnswerIndex: question.correctAnswerIndex as number,
    	});
    	return;
  	}

  	const sdk = new ThirdwebSDK(
    	new ethers.Wallet(
      		process.env.WALLET_PRIVATE_KEY as string,
      		// Using Polygon Mumbai network
      		ethers.getDefaultProvider("https://winter-icy-sun.matic-testnet.quiknode.pro/f36aa318f8f806e4e15a58ab4a1b6cb9f9e9d9b9/")
    	),
  	);

  	console.log(`Transferring a pack to ${address}...`);
  	const packModule = sdk.getPackModule(packAddress);
  	const packTokenId = '0';
  	packModule.transfer(address, packTokenId, BigNumber.from(1));

  	res.status(200).json({
    	kind: "correct",
  	});
}
