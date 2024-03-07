// https://book.starknet.io/ch04-05-06-web-wallet.html#transaction-signing-process

const tx = await connection.account.execute({
  //let's assume this is an erc20 contract
  contractAddress: "0x...",
  selector: "transfer",
  calldata: [
    "0x...",
    // ...
  ],
});

const transferCalls = () => {
  return [
    {
      contractAddress: ETHTokenAddress,
      entrypoint: "transfer",
      calldata: [account.address, Number(bigDecimal.parseEther(transferAmount).value), 0],
    },
  ];
};
