import React, { useEffect } from "react";
import { A, B, C, D, E } from "./MyWalletStyles";
import {
  useAccount,
  useBalance,
  useConnect,
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

  return (
    <A>
      <B onClick={() => connect({ connector: connectors[1] })}>Connect</B>
      <C onClick={() => disconnect()}>Disconnect</C>
      <D onClick={() => signTypedData(exampleData)}>Sign</D>
      {isPending && <Loader message='Pending signature...' />}
      {data && <E>{data}</E>}
    </A>
  );
};

export default MyWallet;
