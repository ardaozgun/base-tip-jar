import { baseSepolia } from "wagmi/chains";
import { createConfig, cookieStorage, createStorage, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { baseAccount } from "@base-org/account/wagmi";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    baseAccount({ appName: "Base Tip Jar" }),
  ],
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [baseSepolia.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL ?? "https://sepolia.base.org"
    ),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
