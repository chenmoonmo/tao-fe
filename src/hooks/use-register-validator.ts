import { useTransactionDialog } from "@/components/transaction-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  usePublicClient,
  useAccount,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { subnetABI as abi } from "@/abis";
import { subnetContractAddress, tokenAddress } from "@/constants/contracts";
import { Address, erc20Abi, parseUnits } from "viem";

export const useRegisterValidator = () => {
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();

  const { address } = useAccount();

  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [address!, subnetContractAddress],
  });

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

  const registerValidator = useCallback(async () => {
    console.log("registerMinerInfo");

    showDialog({
      title: "Transaction Confirmation",
      content: "Please confirm the transaction in your wallet",
      status: "loading",
    });

    const data = (await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/validatorReplace?validator=${address}&subnet=${subnetContractAddress}`
    ).then((res) => res.json())) as { ReplaceStaker: Address };

    try {
      if (allowance === BigInt(0)) {
        const aproveHash = await writeContractAsync({
          abi: erc20Abi,
          address: tokenAddress,
          functionName: "approve",
          args: [
            subnetContractAddress,
            parseUnits("100000000000000000000000", 18),
          ],
        });

        const aproveTransaction = await publicClient?.waitForTransactionReceipt(
          {
            hash: aproveHash,
          }
        );

        if (aproveTransaction?.status === "reverted") {
          throw new Error("Transaction Reverted");
        }
      }

      const hash = await writeContractAsync({
        abi,
        address: subnetContractAddress,
        functionName: "registerLegalStaker",
        args: [address!, data.ReplaceStaker],
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
  }, [
    address,
    allowance,
    hideDialog,
    publicClient,
    showDialog,
    writeContractAsync,
  ]);

  return { registerValidator };
};
