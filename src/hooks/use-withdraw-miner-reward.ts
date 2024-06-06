import { useTransactionDialog } from "@/components/transaction-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { usePublicClient, useAccount, useWriteContract } from "wagmi";
import { subnetABI as abi } from "@/abis";
import { subnetContractAddress } from "@/constants/contracts";

export const useWithdrawMinerReward = () => {
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();

  const { address } = useAccount();

  const { writeContractAsync } = useWriteContract();

  const { showDialog, hideDialog } = useTransactionDialog();

  const withdrawMinerReward = useCallback(
    async (epoch: number) => {
      showDialog({
        title: "Transaction Confirmation",
        content: "Please confirm the transaction in your wallet",
        status: "loading",
      });
      try {
        
        const hash = await writeContractAsync({
          abi,
          address: subnetContractAddress,
          functionName: "withdrawMinerReward",
          args: [BigInt(epoch)],
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

        showDialog({
          title: "Transaction Confirmation",
          content: "Transaction Pending",
          status: "loading",
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
          queryKey: ["rewards", "miner", address],
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

  return { withdrawMinerReward };
};
