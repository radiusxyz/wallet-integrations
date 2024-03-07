import React, { useEffect } from "react";
import { A, B, C, D, E, F } from "./MyWalletStyles";
import {
  useAccount,
  useBalance,
  useConnect,
  useContractWrite,
  useDisconnect,
  useNetwork,
  useProvider,
  useSignTypedData,
} from "@starknet-react/core";
import Loader from "./Loader";

const MyWallet = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, isReconnecting, account } = useAccount();
  const exampleData = {
    "types": {
      "StarkNetDomain": [{ "name": "version", "type": "felt" }],
      "Msg": [{ "name": "contents", "type": "felt" }],
    },
    "primaryType": "Msg",
    "domain": {
      "version": "1",
    },
    "message": {
      "contents": "Hello World",
    },
  };
  const { data, isPending, signTypedData } = useSignTypedData(exampleData);

  const { provider } = useProvider();
  const {
    chain: { id, name },
  } = useNetwork();

  const {
    isLoading,
    isError,
    error,
    data: balanceData,
  } = useBalance({
    address,
    watch: true,
  });

  useEffect(() => {
    console.log("Connected chain: ", name);
    console.log("Connected chain id: ", id);
  }, [id, name]);

  useEffect(() => {
    if (!isError && isLoading) {
      console.log("Balance is loading...");
    }
    if (isError) {
      console.log("Error in getting the balance...");
      console.log(address);
      console.log("Error message:", error.message);
    }

    if (balanceData) {
      console.log("Balance is: ", balanceData);
    }
  }, [balanceData, isError, isLoading]);

  const calls = [
    {
      contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      entrypoint: "transfer",
      calldata: ["0x04D6029994c9CE393C66c759d1152ca05EA412318ff45D4d2439ee68F350Eb96", "10000000", 0],
    },
  ];

  const { write } = useContractWrite({ calls });

  return (
    <A>
      <B onClick={() => connect({ connector: connectors[0] })}>Connect</B>
      <C onClick={() => disconnect()}>Disconnect</C>
      <D onClick={() => signTypedData(exampleData)}>Sign</D>
      {isPending && <Loader message='Pending signature...' />}
      {data && <E>{data}</E>}
      <F onClick={() => write()}>Transferros Tokenados</F>
    </A>
  );
};

export default MyWallet;
