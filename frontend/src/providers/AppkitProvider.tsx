import { createAppKit } from "@reown/appkit/react";

import { AppKitNetwork } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_REOWN_APPKIT_PROJECT_ID;

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  solana,
  solanaTestnet,
  solanaDevnet,
];

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks,
  projectId,
  features: {
    onramp: true,
    swaps: true,
    email: true, // default to true
    socials: [
      "google",
      "x",
      "discord",
      "farcaster",
      "github",
      "apple",
      "facebook",
    ],
    emailShowWallets: true, // default to true
  },

  allWallets: "SHOW",
});

console.log("AppKit initialized", solanaWeb3JsAdapter);

export function AppKitProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
