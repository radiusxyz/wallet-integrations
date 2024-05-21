const starknet = require("starknet");
const accountAddress = '0x01D410062E52140C8b187A617B4fD2087Aa35Ed3A1cA87f9050C8bdf1bA87273';

// Initialize provider
const provider = new starknet.RpcProvider({ nodeUrl: "http://0.0.0.0:5050" });

// Function to get the contract class
async function getContractClass(address) {
  try {
    const contractClass = await provider.getClassAt(address);
    console.log('Contract Class:', contractClass);
  } catch (error) {
    console.error('Error fetching contract class:', error);
  }
}

// Call the function
getContractClass(accountAddress);