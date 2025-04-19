
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, moonbeam } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { walletConnectProvider } from '@rainbow-me/rainbowkit/walletConnectProvider';

const projectId = "f648e94e1f1c32327aaa0416d6409e2b";

const { chains, publicClient } = configureChains(
  [moonbeam, mainnet],
  [
    walletConnectProvider({ projectId }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Decentrabot',
  projectId,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export { chains, wagmiConfig };
