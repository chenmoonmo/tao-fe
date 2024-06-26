import { useTransactionDialog } from "@/components/transaction-provider";
import { subnetContractAddress } from "@/constants/contracts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { Address } from "viem";
import { subnetABI as abi } from "@/abis";

import { usePublicClient, useAccount, useWriteContract } from "wagmi";

export const useSetWeight = () => {
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();

  const { address } = useAccount();

  const { writeContractAsync } = useWriteContract();

  const { showDialog, hideDialog } = useTransactionDialog();

  const setWeight = useCallback(
    async (miners: Address[], weights: bigint[]) => {
      showDialog({
        title: "Transaction Confirmation",
        content: "Please confirm the transaction in your wallet",
        status: "loading",
      });
      try {
        const hash = await writeContractAsync({
          abi,
          address: subnetContractAddress,
          functionName: "setWeight",
          args: [miners, weights],
        });

        showDialog({
          title: "Transaction Confirmation",
          content: "Transaction Pending",
          status: "loading",
        });

        const transaction = await publicClient?.waitForTransactionReceipt({
          hash,
        });

        if (transaction?.status === "reverted") {
          throw new Error("Transaction Reverted");
        }

        showDialog({
          title: "Transaction Confirmation",
          content: "Transaction Confirmed",
          status: "success",
        });
      } catch (e) {
        console.error(e);
        showDialog({
          title: "Transaction Error",
          content: "Please try again",
          status: "error",
        });
      }

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["validator", address],
        });
        hideDialog();
      }, 3000);
    },
    [
      address,
      hideDialog,
      publicClient,
      queryClient,
      showDialog,
      writeContractAsync,
    ]
  );

  return { setWeight };
};
