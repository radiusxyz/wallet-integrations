const starknet = require("starknet");
const fs = require("fs");

//          👇👇👇
// 🚨🚨🚨 launch 'cargo run --release -- --seed 0' in devnet-rs directory before using this script
//          Before execution, launch the script for deployment of Test (script 4 or 5).
//          👆👆👆
async function main() {
  const provider = new starknet.RpcProvider({ nodeUrl: "http://0.0.0.0:5050" });

  const contractAddress = "0x1d7a13de755ee5a4e57c13170c198a13d9fa82b54a78e835afb6b8e0fbf0728";

  const privateKey0 = "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a";
  const accountAddress0 = "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca";
  const account0 = new starknet.Account(provider, accountAddress0, privateKey0);

  const compiledTest = starknet.json.parse(
    fs.readFileSync("./contracts/my_contract_CustomERC20.contract_class.json").toString("ascii")
  );
  const myTestContract = new starknet.Contract(compiledTest.abi, contractAddress, provider);
  myTestContract.connect(account0);
  console.log("Test Contract connected at =", myTestContract.address);

  const { suggestedMaxFee: estimatedFee1 } = await account0.estimateInvokeFee({
    contractAddress: contractAddress,
    entrypoint: "test",
    calldata: [],
  });

  const result = await myTestContract.invoke("transfer_with_signature", [
    "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca",
    ["612038676694872305271194504474452794034754768459451584265129415286900941546",
      "1609324115293251263217555757947606450798870420452616025971690244063981725919",
    ]
  ]);
  await provider.waitForTransaction(result.transaction_hash);

  console.log("✅ Test completed.");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
