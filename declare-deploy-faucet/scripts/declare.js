// Declare a contract.
// launch with npx ts-node src/scripts/9.declareContract.ts
// Coded with Starknet.js v5.16.0, Starknet-devnet-rs v0.1.0

const starknet = require("starknet");
const fs = require("fs");

//          👇👇👇
// 🚨🚨🚨 launch 'cargo run --release -- --seed 0' in devnet-rs directory before using this script
//          👆👆👆
async function main() {
  const provider = new starknet.RpcProvider({ nodeUrl: "http://0.0.0.0:5050" }); // only for starknet-devnet-rs
  console.log("Provider connected to Starknet-devnet-rs");

  // initialize existing predeployed account 0 of Devnet
  const privateKey0 = "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a";
  const accountAddress0 = "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca";
  const account0 = new starknet.Account(provider, accountAddress0, privateKey0);
  console.log("Account 0 connected.\n");

  // Declare Test contract in devnet
  const testSierra = starknet.json.parse(
    fs.readFileSync("./contracts/my_contract_CustomERC20.contract_class.json").toString("ascii")
  );
  const testCasm = starknet.json.parse(
    fs.readFileSync("./contracts/my_contract_CustomERC20.compiled_contract_class.json").toString("ascii")
  );

  const { suggestedMaxFee: fee1 } = await account0.estimateDeclareFee({ contract: testSierra, casm: testCasm });
  console.log("suggestedMaxFee =", fee1.toString(), "wei");

  const declareResponse = await account0.declare(
    { contract: testSierra, casm: testCasm },
    { maxFee: (fee1 * 11n) / 10n }
  );

  console.log("Test Contract Class Hash =", declareResponse.class_hash);
  await provider.waitForTransaction(declareResponse.transaction_hash);
  console.log("✅ Test completed.");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
