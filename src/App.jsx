import { StarknetConfig, publicProvider, argent, braavos } from "@starknet-react/core";
import { goerli } from "@starknet-react/chains";
import MyWallet from "./MyWallet";
import { useInjectedConnectors } from "@starknet-react/core";

function App() {
  const chains = [goerli];
  const provider = publicProvider();
  // const { connectors } = useInjectedConnectors([argent(), braavos()]);
  const connectors = [argent(), braavos()];

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors}>
      <MyWallet />
    </StarknetConfig>
  );
}

export default App;
