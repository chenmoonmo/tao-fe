import { useTransactionDialog } from "@/components/transaction-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { rootABI as abi } from "@/abis";

import { usePublicClient, useAccount, useWriteContract } from "wagmi";
import { rootContractAddress, tokenAddress } from "@/constants/contracts";
import { erc20Abi, parseUnits } from "viem";

export const useValidatorStake = () => {
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();

  const { address } = useAccount();

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ["validator", address],
        });
      },
    },
  });

  const { showDialog, hideDialog } = useTransactionDialog();

  const stake = useCallback(
    async (stakeAmount: string) => {
      console.log("stake");

      showDialog({
        title: "Transaction Confirmation",
        content: "Please confirm the transaction in your wallet",
        status: "loading",
      });

      try {

        const aproveHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress,
          functionName: "approve",
          args: [rootContractAddress, parseUnits("100000000000000000000000", 18)],
        });

        const aproveTransaction = await publicClient?.waitForTransactionReceipt(
          {
            hash: aproveHash,
          }
        );

        if (aproveTransaction?.status === "reverted") {
          throw new Error("Transaction Reverted");
        }

        const hash = await writeContractAsync({
          abi,
          address: rootContractAddress,
          functionName: "stake",
          args: [address!, parseUnits(stakeAmount, 18)],
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
          title: "Transaction Confirmation",
          content: "Transaction Failed",
          status: "error",
        });
      }

      setTimeout(hideDialog, 3000);
    },

    [address, hideDialog, publicClient, showDialog, writeContractAsync]
  );

  return { stake };
};
