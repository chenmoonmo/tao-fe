import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { subnetABI as abi } from "@/abis";
import { useTransactionDialog } from "@/components/transaction-provider";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subnetContractAddress } from "@/constants/contracts";

export const useRegisterMinerInfo = () => {
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();

  const { address } = useAccount();

  const { writeContractAsync } = useWriteContract();

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
        address: subnetContractAddress,
        functionName: "registerMinerInfo",
        args: [address!],
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
        queryKey: ["miner", address],
      });
      hideDialog();
    }, 3000);
  }, [
    address,
    hideDialog,
    publicClient,
    queryClient,
    showDialog,
    writeContractAsync,
  ]);

  return { registerMinerInfo };
};
