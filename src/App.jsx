import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, publicProvider, argent, braavos } from "@starknet-react/core";
import MyWallet from "./MyWallet";

function App() {
  const chains = [sepolia];
  const provider = publicProvider();
  const connectors = [braavos(), argent()];

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors}>
      <MyWallet />
    </StarknetConfig>
  );
}

export default App;
