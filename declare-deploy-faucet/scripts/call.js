const starknet = require("starknet");
const fs = require("fs");

async function main() {
  const provider = new starknet.RpcProvider({ nodeUrl: "http://0.0.0.0:5050" });

  const privateKey = "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a";
  const accountAddress = "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca";
  const account = new starknet.Account(provider, accountAddress, privateKey);
  console.log("Account connected.\n");

  const contractAddress = "0x57a98a251fd382c8c1f8589c75b1e4bf1fb46f4add86a9d8817feb3d198b3ea";
  const contract = starknet.json.parse(
    fs.readFileSync("../contract/target/dev/test_Test.contract_class.json").toString("ascii")
  );

  const myTestContract = new starknet.Contract(contract.abi, contractAddress, provider);
  console.log("Test Contract connected at =", myTestContract.address);

  // Interactions with the contract with call & invoke
  myTestContract.connect(account);

  // const result = await myTestContract.invoke("test", ["0xe29882a1fcba1e7e10cad46212257fea5c752a4f9b1b1ec683c503a2cf5c8a"]);
  const result = await myTestContract.invoke("test", [
    "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca",
    [
      3238853470143566752206770883652454053923106512055061817645688057025093434807n,
      3562141297260333124195890323830522856296838523777737137769515814757672076671n
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
