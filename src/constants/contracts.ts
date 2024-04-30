import { Address } from "viem";
import { goerli } from "viem/chains";

export const CONTRACTS: {
  [chainId: number]: {
    LiquidityLaunchpad: string;
  };
} = {
  [goerli.id]: {
    LiquidityLaunchpad: process.env.NEXT_PUBLIC_GOERLI_LIQ_LAUNCHPAD as string,
  },
};



export const subnetContractAddress = process.env.NEXT_PUBLIC_SUBNET_CONTRACT_ADDRESS as Address;
export const rootContractAddress = process.env.NEXT_PUBLIC_ROOT_CONTRACT_ADDRESS as Address;
export const tokenAddress = process.env.NEXT_PUBLIC_TAO_TOKEN_ADDRESS as Address;