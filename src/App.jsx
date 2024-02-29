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
      console.log(signer);
      const toSignMessage = {
        "types": {
          "StarkNetDomain": [
            { "name": "name", "type": "felt" },
            { "name": "version", "type": "felt" },
            { "name": "chainId", "type": "felt" },
          ],
          "Person": [
            { "name": "name", "type": "felt" },
            { "name": "wallet", "type": "felt" },
          ],
          "Mail": [
            { "name": "from", "type": "Person" },
            { "name": "to", "type": "Person" },
            { "name": "contents", "type": "felt" },
          ],
        },
        "primaryType": "Mail",
        "domain": {
          "name": "StarkNet Mail",
          "version": "1",
          "chainId": 1,
        },
        "message": {
          "from": {
            "name": "Cow",
            "wallet": "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
          },
          "to": {
            "name": "Bob",
            "wallet": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          },
          "contents": "Hello World",
        },
      };

      const signedMessage = await provider.signMessage(toSignMessage);
      console.log(signedMessage);
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

/* 

  "2187141356957706744976776999527100874577338982907254937424583108635851815118",
  "10000000000000",
  "0"

*/

/* 


  describe('Signatures', () => {
    test('Message signature', async () => {
      const myPrivateKey = '0x525bc68475c0955fae83869beec0996114d4bb27b28b781ed2a20ef23121b8de';
      const myEthSigner = new EthSigner(myPrivateKey);
      const message = typedDataExample;
      const sig = await myEthSigner.signMessage(
        message,
        '0x65a822fbee1ae79e898688b5a4282dc79e0042cbed12f6169937fddb4c26641'
      );
      expect(sig).toMatchObject({
        r: 46302720252787165203319064060867586811009528414735725622252684979112343882634n,
        s: 44228007167516598548621407232357037139087111723794788802261070080184864735744n,
        recovery: 1,
      });
    });

*/
