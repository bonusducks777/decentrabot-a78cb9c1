import { useState, useEffect } from "react";
import { RainbowKitProvider as RKProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { http, createConfig, WagmiProvider, Chain } from "wagmi";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "@/components/ThemeProvider";
import "@rainbow-me/rainbowkit/styles.css";

interface RainbowKitWrapperProps {
  children: React.ReactNode;
}

// WalletConnect Project ID
const projectId = "f648e94e1f1c32327aaa0416d6409e2b";

// Define the Westend testnet
const westend = {
  id: 42262,
  name: 'Westend',
  nativeCurrency: {
    name: 'Westend',
    symbol: 'WND',
    decimals: 12,
  },
  rpcUrls: {
    default: {
      http: ['wss://westend-rpc.dwellir.com'],
    },
    public: {
      http: ['wss://westend-rpc.dwellir.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Westend Subscan',
      url: 'https://westend.subscan.io',
    },
  },
  testnet: true,
} as const satisfies Chain;

// Chain configuration with Westend for Polkadot ecosystem
const chains = [westend] as const;

// Get wallets using the proper API for RainbowKit v2
const { connectors } = getDefaultWallets({
  appName: "Decentrabot",
  projectId,
});

// Create wagmi config
const config = createConfig({
  chains,
  transports: {
    [westend.id]: http(),
  },
  connectors,
});

// Create query client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const RainbowKitProvider: React.FC<RainbowKitWrapperProps> = ({ children }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure window is available before mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RKProvider theme={theme === "dark" ? darkTheme() : lightTheme()}>
          {children}
        </RKProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitProvider;
export { config };
