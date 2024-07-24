// interact with a contract that is already deployed on devnet.
// launch with npx ts-node src/scripts/11.CallInvokeContract.ts
// Coded with Starknet.js v5.16.0, Starknet-devnet-rs v0.1.0

const starknet = require("starknet");
const fs = require("fs");

//          👇👇👇
// 🚨🚨🚨 launch 'cargo run --release -- --seed 0' in devnet-rs directory before using this script
//          Before execution, launch the script for deployment of Test (script 4 or 5).
//          👆👆👆
async function main() {
  const provider = new starknet.RpcProvider({ nodeUrl: "http://0.0.0.0:5050" }); // only for starknet-devnet-rs
  console.log("Provider connected to Starknet-devnet-rs");

  // initialize existing predeployed account 0 of Devnet-rs
  const privateKey0 = "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a";
  const accountAddress0 = "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca";
  const account0 = new starknet.Account(provider, accountAddress0, privateKey0);
  console.log("Account 0 connected.\n");

  /*   
      ref self: ContractState,
      recipient: ContractAddress,
      amount: u256,
      nonce: felt252,
      expiry: u64,
      signature: Array<felt252>
  */

  /*   
      recipient: 0xe29882a1fcba1e7e10cad46212257fea5c752a4f9b1b1ec683c503a2cf5c8a,
      amount: 0.1,
      nonce: '0x1',
      expiry: 0,
      signature: Array<felt252>
  */

  // Connect the deployed Test instance in devnet-rs
  //          👇👇👇
  // 🚨🚨🚨 modify in accordance with result of script 5
  const testAddress = "0x4d7b4c728bb76b6399b4d9f68a9f89625b814d5d8675a37ef21f2d6e8520808";
  const compiledTest = starknet.json.parse(
    fs.readFileSync("./contracts/my_contract_CustomERC20.contract_class.json").toString("ascii")
  );
  const myTestContract = new starknet.Contract(compiledTest.abi, testAddress, provider);
  console.log("Test Contract connected at =", myTestContract.address);

  // Interactions with the contract with call & invoke
  myTestContract.connect(account0);
  // estimate fee
  const { suggestedMaxFee: estimatedFee1 } = await account0.estimateInvokeFee({
    contractAddress: testAddress,
    entrypoint: "test",
    calldata: [],
  });

  const result = await myTestContract.invoke("test", []);
  await provider.waitForTransaction(result.transaction_hash);

  console.log("✅ Test completed.");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
