import { getDefaultConfig } from "connectkit";
import { goerli } from "viem/chains";
import { createConfig } from "wagmi";

export const chains = [goerli];

export const config = createConfig(
  getDefaultConfig({
    chains: [goerli],
    appName: "q dex",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
  })
);
