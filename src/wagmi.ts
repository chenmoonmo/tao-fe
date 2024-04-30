import { getDefaultConfig } from "connectkit";
import { sepolia } from "viem/chains";
import { createConfig } from "wagmi";

export const chains = <const>[sepolia];

export const config = createConfig(
  getDefaultConfig({
    chains,
    appName: "tao reward",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
  })
);
