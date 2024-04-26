import { useMemo } from "react";
import { useAccount } from "wagmi";
import { CONTRACTS } from "../constants/contracts";
import { chains } from "@/wagmi";

export const useContracts = () => {
  const { chain } = useAccount();

  return useMemo(
    () => CONTRACTS[chain?.id ?? chains[0].id] ?? CONTRACTS[chains[0].id],
    [chain]
  );
};
