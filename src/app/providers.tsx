"use client";

import * as React from "react";
import { ConnectKitProvider } from "connectkit";
import { Theme } from "@radix-ui/themes";
import { WagmiProvider } from "wagmi";
import { TransactionDialogProvider } from "@/components/transaction-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@radix-ui/themes/styles.css";

import { config } from "../wagmi";

type ProviderProps = {
  children: React.ReactNode;
  chainIds?: number[];
};

const queryClient = new QueryClient();

export const Providers = React.memo(({ children }: ProviderProps) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          mode="dark"
          customTheme={{
            "--ck-connectbutton-background": "#1F2127",
            "--ck-connectbutton-border-radius": "6px",
            "--ck-connectbutton-box-shadow": "inset 0 0 0 1px #363A45",
            "--ck-connectbutton-color": "#737884",
          }}
        >
          <Theme appearance="dark" accentColor="blue">
            <TransactionDialogProvider>{children}</TransactionDialogProvider>
          </Theme>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
});

Providers.displayName = "Providers";
