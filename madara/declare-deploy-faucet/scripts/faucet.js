const starknet = require("starknet");
const ERC20 = require("../contracts/ERC20.json");

const eth_address = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const provider = new starknet.RpcProvider({
  nodeUrl: "http://localhost:5050",
});
const account = new starknet.Account(
  provider,
  "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca",
  "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a",
  "1"
);

async function transfer(to) {
  const contract = new starknet.Contract(ERC20.abi, eth_address, provider);
  let result = contract.populate("transfer", {
    recipient: to,
    amount: {
      low: 1e20,
      high: 0,
    },
  });

  let hash = await account.execute(result, undefined);

  console.log("Txn hash - ", hash);
}

transfer(process.argv[2]);
