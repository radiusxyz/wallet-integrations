import React, { useEffect, useState } from "react";
import { connect, disconnect } from "starknetkit";

// const wallet = await connect({s options: { id: 'argentX' } });

function App() {
  const [connection, setConnection] = useState("");
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    const { wallet } = await connect();

    if (wallet && wallet.isConnected) {
      setConnection(wallet);
      setAccount(wallet.account);
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
    setConnection(undefined);
    setAccount(undefined);
  };

  useEffect(() => {
    if (!connection) return;
    const sendTx = async () => {
      // const a = await provider.signMessage(["56"]);
      const a = await account.signer.getPubKey();
      console.log(account);
      console.log("pubKey", a);
      console.log(account.signer.signTransaction);
      const tokenAddress = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
      const transferTo = "0x04D6029994c9CE393C66c759d1152ca05EA412318ff45D4d2439ee68F350Eb96";
      const cairoVersion = await account.getCairoVersion();
      const address = await account.address;
      const nonce = await account.getNonce();
      const chainId = await account.getChainId();
      const transactionsDetail = {
        walletAddress: address,
        chainId: chainId,
        cairoVersion: cairoVersion,
        maxFee: "10",
        nonce: nonce,
      };
      console.log(transactionsDetail);
      console.log(
        await account.signer.signTransaction(
          ["604981810360618484056155877014916320672157534189046781737194855884205175858", "1000000000000", "0"],
          transactionsDetail
        )
      );
    };
    sendTx();
  }, [connection]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: 20,
      }}
    >
      <button
        onClick={connectWallet}
        style={{
          backgroundColor: "darkgreen",
          padding: "20px 80px",
          borderRadius: 10,
          color: "white",
          fontWeight: 700,
          border: "none",
          fontSize: 30,
          cursor: "pointer",
        }}
      >
        Connect
      </button>
      <button
        onClick={disconnectWallet}
        style={{
          backgroundColor: "darkred",
          padding: "20px 80px",
          borderRadius: 10,
          color: "white",
          fontWeight: 700,
          border: "none",
          fontSize: 30,
          cursor: "pointer",
        }}
      >
        Disconnect
      </button>
    </div>
  );
}

export default App;
