import { ethers } from "ethers"; // Import ethers from ethers directly
import { ethers as hardhatEthers } from "hardhat"; // Use hardhat ethers for signer only

async function main() {
    const web3CXITokenAddress = "0x4D6Ba58B30125444d280194904187fd8C76f6c6C";
    const saveERC20ContractAddress = "0x903B51D442fD785B750fDC4a58CE15b976d2c1D8";
    
    // Get signer from Hardhat environment
    const [signer] = await hardhatEthers.getSigners();

    // Define the ABI for both contracts
    const erc20ABI = [
        // Minimal ERC20 ABI for approve function
        "function approve(address spender, uint256 amount) public returns (bool)"
    ];
    
    const saveERC20ABI = [
        // Replace with your actual ISaveERC20 contract's ABI
        "function deposit(uint256 amount) public returns (bool)",
        "function withdraw(uint256 amount) public returns (bool)",
        "function getContractBalance() public view returns (uint256)"
    ];

    // Instantiate contracts using ethers.Contract directly
    const web3CXI = new ethers.Contract(web3CXITokenAddress, erc20ABI, signer);
    const saveERC20 = new ethers.Contract(saveERC20ContractAddress.trim(), saveERC20ABI, signer);

    // Approve savings contract to spend token
    const approvalAmount = ethers.parseUnits("1000", 18);
    const approveTx = await web3CXI.approve(saveERC20ContractAddress.trim(), approvalAmount);
    await approveTx.wait();

    const contractBalanceBeforeDeposit = await saveERC20.getContractBalance();
    console.log("Contract balance before :::", contractBalanceBeforeDeposit.toString());

    const depositAmount = ethers.parseUnits("150", 18);
    const depositTx = await saveERC20.deposit(depositAmount);
    await depositTx.wait();

    const contractBalanceAfterDeposit = await saveERC20.getContractBalance();
    console.log("Contract balance after :::", contractBalanceAfterDeposit.toString());

    // Withdrawal Interaction
    const withdrawalAmount = ethers.parseUnits("100", 18);
    const withdrawalTx = await saveERC20.withdraw(withdrawalAmount);
    await withdrawalTx.wait();
    console.log("Withdrawal transaction:", withdrawalTx);
}

// Execute the main function and handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
