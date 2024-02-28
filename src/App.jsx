import React, { useEffect, useState } from "react";
import { connect, disconnect } from "starknetkit";

// const wallet = await connect({ options: { id: 'argentX' } });

function App() {
  const [connection, setConnection] = useState("");
  const [provider, setProvider] = useState("");
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState("");

  const connectWallet = async () => {
    const { wallet } = await connect();

    if (wallet && wallet.isConnected) {
      console.log(wallet);
      setConnection(wallet);
      setProvider(wallet.account);
      setAddress(wallet.selectedAddress);
      setSigner(wallet.account.signer);
    }
  };

  const disconnectWallet = async () => {
    await disconnect();

    setConnection(undefined);
    setProvider(undefined);
    setAddress("");
  };

  useEffect(() => {
    if (!signer) return;
    const getPubKey = async () => {
      const pubKey = await signer.getPubKey();
      console.log(pubKey);
      console.log(signer);
      const toSignMessage = "hello world";

      const signedMessge = await signer.signMessage(toSignMessage);
      console.log(signedMessge);
    };
    getPubKey();
  }, [provider]);

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
