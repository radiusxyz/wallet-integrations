import { useState } from "react";
import { connect, disconnect } from "starknetkit";

const useWallet = (rpcProvider) => {
    const [connection, setConnection] = useState();
    const [provider, setProvider] = useState();
    const [address, setAddress] = useState();

    const connectWallet = async () => {
        try {
            const { wallet } = await connect({ provider: rpcProvider });
            console.log(wallet)
            if (wallet && wallet.isConnected) {
                setConnection(wallet);
                setProvider(wallet.account);
                setAddress(wallet.selectedAddress);
            } else {
                console.error("Failed to connect to the wallet");
            }
        } catch (error) {
            console.error("Error connecting to wallet", error);
        }
    }

    const disconnectWallet = async () => {
        await disconnect();
        setConnection(undefined);
        setProvider(undefined);
        setAddress('');
    }

    return { wallet: { connection, provider, address }, walletFns: { connectWallet, disconnectWallet } };
}
export default useWallet;