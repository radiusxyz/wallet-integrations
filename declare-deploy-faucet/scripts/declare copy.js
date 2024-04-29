const starknet = require("starknet");
const fs = require("fs");

const provider = new starknet.RpcProvider({
  nodeUrl: "http://0.0.0.0:5050",
});
const account = new starknet.Account(
  provider,
  "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca",
  "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a"
);

const accountAddress0 = "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca";
const privateKey0 = "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a";
const account0 = new starknet.Account(provider, accountAddress0, privateKey0);
console.log("Account 0 connected.\n");
// Declare Test contract in devnet
const testSierra = starknet.json.parse(
  fs.readFileSync("./contracts/my_contract_CustomERC20.contract_class.json").toString("ascii")
);
const testCasm = starknet.json.parse(
  fs.readFileSync("./contracts/my_contract_CustomERC20.compiled_contract_class.json").toString("ascii")
);

async function main(sierraPath, casmPath) {
  const currentDir = process.cwd();
  const sierra = require(`${currentDir}/${sierraPath}`);
  const casm = require(`${currentDir}/${casmPath}`);

  try {
    const { suggestedMaxFee: fee1 } = await account0.estimateDeclareFee({ contract: testSierra, casm: testCasm });
    // console.log("suggestedMaxFee =", fee1.toString(), "wei");
    // const declareResponse = await account0.declare(
    //   { contract: testSierra, casm: testCasm },
    //   { maxFee: (fee1 * 11n) / 10n }
    // );

    console.log("This is the declare result - ", declareResponse);
  } catch (err) {
    console.log("Contract is already declared", err);
  }
}

main(process.argv[2], process.argv[3]);
