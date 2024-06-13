import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { subnetABI as abi } from "@/abis";
import { useTransactionDialog } from "@/components/transaction-provider";
import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subnetContractAddress } from "@/constants/contracts";

export const useRegisterMinerInfo = () => {
  const queryClient = useQueryClient();

  const { address } = useAccount();

  const { data: hash, writeContractAsync } = useWriteContract();

  const { showDialog, hideDialog } = useTransactionDialog();

  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
    error,
    data: transaction,
  } = useWaitForTransactionReceipt({
    hash,
  });

  console.log(isConfirming, isSuccess, isError, transaction);

  const registerMinerInfo = useCallback(async () => {
    console.log("registerMinerInfo");

    showDialog({
      title: "Transaction Confirmation",
      content: "Please confirm the transaction in your wallet",
      status: "loading",
    });

    try {
      await writeContractAsync({
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
    } catch (e) {
      showDialog({
        title: "Transaction Error",
        content: "Please try again",
        status: "error",
      });
      console.log(e);
    }
  }, [address, showDialog, writeContractAsync]);

  useEffect(() => {
    if (!isConfirming && transaction?.status === "success") {
      showDialog({
        title: "Transaction Confirmation",
        content: "Transaction Confirmed",
        status: "success",
      });
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["miner", address],
        });
        hideDialog();
      }, 3000);
    } else if (!isConfirming && transaction?.status === "reverted") {
      showDialog({
        title: "Transaction Error",
        content: "Transaction Reverted",
        status: "error",
      });
      setTimeout(() => {
        hideDialog();
      }, 1500);
    }
  }, [
    address,
    hideDialog,
    isConfirming,
    queryClient,
    showDialog,
    transaction?.status,
  ]);

  return { registerMinerInfo };
};
