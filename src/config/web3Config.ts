
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { moonbeam, mainnet } from 'wagmi/chains';
import { http } from 'wagmi';

const projectId = "f648e94e1f1c32327aaa0416d6409e2b";

const web3Config = getDefaultConfig({
  appName: 'Decentrabot',
  projectId,
  chains: [moonbeam, mainnet],
  transports: {
    [moonbeam.id]: http(),
    [mainnet.id]: http(),
  },
});

export { web3Config as config };
