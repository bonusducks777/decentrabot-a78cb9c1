
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { moonbeam } from 'wagmi/chains';
import { http } from 'wagmi';

// Use a project ID from WalletConnect - this is a placeholder
const projectId = "f648e94e1f1c32327aaa0416d6409e2b";

const web3Config = getDefaultConfig({
  appName: 'Decentrabot',
  projectId,
  chains: [moonbeam], // Focus only on Moonbeam for Polkadot ecosystem
  transports: {
    [moonbeam.id]: http(),
  },
});

export { web3Config as config };
