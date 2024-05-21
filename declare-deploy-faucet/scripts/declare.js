const starknet = require("starknet");
const fs = require("fs");

async function main() {
  const provider = new starknet.RpcProvider({ nodeUrl: "http://0.0.0.0:5050" });

  const privateKey = "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a";
  const accountAddress = "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca";
  const account = new starknet.Account(provider, accountAddress, privateKey);
  console.log("Account connected.\n");

  // Declare Test contract in devnet
  const contract = starknet.json.parse(
    fs.readFileSync("../contract/target/dev/test_Test.contract_class.json").toString("ascii")
  );
  const casm = starknet.json.parse(
    fs.readFileSync("../contract/target/dev/test_Test.compiled_contract_class.json").toString("ascii")
  );

  const { suggestedMaxFee: fee } = await account.estimateDeclareFee({ contract, casm });

  const declareResponse = await account.declare(
    { contract, casm },
    { maxFee: (fee * 11n) / 10n }
  );

  console.log("Test Contract Class Hash =", declareResponse.class_hash);

  await provider.waitForTransaction(declareResponse.transaction_hash);

  console.log("✅ Declare completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
