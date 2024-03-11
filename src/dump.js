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

const sig = await myEthSigner.signTransaction([myCall], {
  version: "0x2",
  walletAddress: "0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691",
  cairoVersion: "1",
  chainId: constants.StarknetChainId.SN_SEPOLIA,
  nonce: 45,
  maxFee: 10 ** 15,
});
