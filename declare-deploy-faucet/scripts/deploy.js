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
  const classHash = "0x3511f232b08dab506e1b72734968f2d09a3fc2db9f9574910663217afb8abe";

  const contract = starknet.json.parse(
    fs.readFileSync("../contract/target/dev/test_Test.contract_class.json").toString("ascii")
  );

  const myCallData = new starknet.CallData(contract.abi);

  const constructorCalldata = myCallData.compile("constructor", {});

  const { suggestedMaxFee: estimatedFee1 } = await account.estimateDeployFee({
    classHash,
    constructorCalldata,
  });

  const deployResponse = await account.deployContract(
    {
      classHash,
      constructorCalldata,
    },
    { maxFee: (estimatedFee1 * 11n) / 10n }
  );
  const myTestContract = new starknet.Contract(contract.abi, deployResponse.contract_address, provider);
  console.log("✅ Test Contract connected at =", myTestContract.address);
}

main(process.argv[2]);
