"use client";
const { useState, useEffect } = require("react");
import useLoader from "@/hooks/useLoader";
import useWallet from "@/hooks/useWallet";
import { Contract, RpcProvider } from "starknet";

// TODO: Replace CONTRACT_ADDRESS with your deployed contract address
const CONTRACT_ADDRESS = "0x4d7b4c728bb76b6399b4d9f68a9f89625b814d5d8675a37ef21f2d6e8520808";
const contractABI = require("../lib/ContractABI.json");
const rpcProvider = new RpcProvider({ nodeUrl: "http://localhost:5050" });
const contract = new Contract(contractABI.abi, CONTRACT_ADDRESS, rpcProvider);

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

const Counter = () => {
  const [count, setCount] = useState(null);
  const { loading, startLoading, stopLoading } = useLoader();
  const { wallet, walletFns } = useWallet(rpcProvider);
  const { connection } = wallet;

  const fetchCount = async () => {
    if (!contract?.address) return;
    const count = await contract.get_current_count();
    setCount(Number(count));
  };
  // fetchCount();

  async function executeTxn(_) {
    if (!connection || !_?.target?.id) return;
    startLoading();
    const calls = [
      {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: _.target.id,
        calldata: [],
      },
    ];
    try {
      const tx = await connection.account.execute(calls);
      await rpcProvider.waitForTransaction(tx.transaction_hash, { retryInterval: 1000 });
      console.log("successfully called function", _.target.id);
    } catch (error) {
      alert("Error: User rejected transaction");
    } finally {
      stopLoading();
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      {loading && <div>Loading...</div>}
      <div className='m-4'>
        <span className='span: text-6xl font-bold'>{count}</span>
      </div>
      <div className='flex space-x-4 mt-4'>
        <button
          onClick={executeTxn}
          id='transfer_with_signature'
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            !connection || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!connection || loading}
        >
          transfer_with_signature
        </button>
        <button
          onClick={executeTxn}
          id='test'
          className={`bg-amber-500 text-white px-4 py-2 rounded ${
            !connection || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!connection || loading}
        >
          test
        </button>
      </div>
      <div className='flex space-x-4 mt-24'>
        {connection ? (
          <button
            className='bg-red-500 text-white px-4 py-2 rounded w-full'
            onClick={walletFns.disconnectWallet}
            style={{ fontSize: "1.5rem" }}
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            className='bg-green-500 text-white px-4 py-2 rounded w-full'
            onClick={walletFns.connectWallet}
            style={{ fontSize: "1.5rem" }}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <div className='flex space-x-4 mt-24'>
        <button
          id='sign'
          className='bg-red-500 text-white px-4 py-2 rounded w-full'
          onClick={async () => {
            console.log("clicked");
            const signature = await connection.account.signMessage(exampleData);
            console.log(signature);
          }}
          style={{ fontSize: "1.5rem" }}
        >
          Sign typedData
        </button>
      </div>
    </div>
  );
};
export default Counter;
