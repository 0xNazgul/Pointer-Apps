async function main() {
    const [owner, somebodyElse] = await hre.ethers.getSigners();
    const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
    const keyboardsContract = await keyboardsContractFactory.deploy();
    await keyboardsContract.deployed();
  
    const keyboardTxn1 = await keyboardsContract.create(0, true, "sepia");
    const keyboardTxnReceipt1 = await keyboardTxn1.wait();
    console.log(keyboardTxnReceipt1.events);
  
    const keyboardTxn2 = await keyboardsContract.connect(somebodyElse).create(1, false, "grayscale");
    await keyboardTxn2.wait();
    const keyboardTxnReceipt2 = await keyboardTxn2.wait();
    console.log(keyboardTxnReceipt2.events);
  
    keyboards = await keyboardsContract.getKeyboards();
    console.log("We got the keyboards!", keyboards);

    const balanceBefore = await hre.ethers.provider.getBalance(somebodyElse.address);
    console.log("somebodyElse balance before!", hre.ethers.utils.formatEther(balanceBefore));
  
    const tipTxn = await keyboardsContract.tip(1, {value: hre.ethers.utils.parseEther("1000")}); // tip the 2nd keyboard as owner!
    const tipTxnReceipt = await keyboardTxn2.wait();await tipTxn.wait();
    console.log(tipTxnReceipt.events);
  
    const balanceAfter = await hre.ethers.provider.getBalance(somebodyElse.address)
    console.log("somebodyElse balance after!", hre.ethers.utils.formatEther(balanceAfter));
}
 
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
  