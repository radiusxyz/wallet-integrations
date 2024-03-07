import React, { useEffect } from "react";
import { A, B, C, D, E } from "./MyWalletStyles";
import { useAccount, useConnect, useDisconnect, useSignTypedData } from "@starknet-react/core";
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

  useEffect(() => {
    if (isConnected) console.log(address);
  }, [isConnected]);

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
