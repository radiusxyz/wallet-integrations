const starknet = require("starknet");
const fs = require("fs");

const provider = new starknet.RpcProvider({
  nodeUrl: "http://0.0.0.0:5050",
});
const account = new starknet.Account(
  provider,
  "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca",
  "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a",
  "1"
);

//0x2288d3c507abfb963730c97a72836222ffe34e0d4fd963dbf9c6e1ecdca5a1

async function main(sierraPath) {
  const testClassHash = "0xbb2fd7a174dbba0cd5d538691c7cdf21a3b42404e445fc74e36a59be19fa97";
  const testSierra = starknet.json.parse(
    fs.readFileSync("./contracts/my_contract_CustomERC20.contract_class.json").toString("ascii")
  );

  const myCallData = new starknet.CallData(testSierra.abi);

  const constructor = myCallData.compile("constructor", {
    initial_supply: 10000,
    recipient: "0xe29882a1fcba1e7e10cad46212257fea5c752a4f9b1b1ec683c503a2cf5c8a",
  });

  const { suggestedMaxFee: estimatedFee1 } = await account.estimateDeployFee({
    classHash: testClassHash,
    constructorCalldata: constructor,
  });

  const deployResponse = await account.deployContract(
    {
      classHash: testClassHash,
      constructorCalldata: constructor,
    },
    { maxFee: (estimatedFee1 * 11n) / 10n }
  );
  const myTestContract = new starknet.Contract(testSierra.abi, deployResponse.contract_address, provider);
  console.log("✅ Test Contract connected at =", myTestContract.address);
}

main(process.argv[2]);
