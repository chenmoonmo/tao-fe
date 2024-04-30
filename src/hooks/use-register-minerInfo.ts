import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { subnetABI as abi } from "@/abis";
import { Address } from "viem";
import { useTransactionDialog } from "@/components/transaction-provider";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useRegisterMinerInfo = () => {
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();

  const { address } = useAccount();

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["miner", address],
        });
      },
    },
  });

  const { showDialog, hideDialog } = useTransactionDialog();

  const registerMinerInfo = useCallback(async () => {
    console.log("registerMinerInfo");

    showDialog({
      title: "Transaction Confirmation",
      content: "Please confirm the transaction in your wallet",
      status: "loading",
    });

    try {
      const hash = await writeContractAsync({
        abi,
        address: process.env.NEXT_PUBLIC_SUBNET_CONTRACT_ADDRESS as Address,
        functionName: "registerMinerInfo",
        args: [address!],
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

    setTimeout(hideDialog, 3000);
  }, [address, hideDialog, publicClient, showDialog, writeContractAsync]);

  return { registerMinerInfo };
};
