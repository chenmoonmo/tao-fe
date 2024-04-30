"use client";
import { subnetContractAddress } from "@/constants/contracts";
import { useRegisterMinerInfo } from "@/hooks/use-register-minerInfo";
import { useWithdrawMinerReward } from "@/hooks/use-withdraw-miner-reward";
import {
  Button,
  Card,
  Heading,
  TableBody,
  TableCell,
  TableColumnHeaderCell,
  TableHeader,
  TableRoot,
  TableRow,
  Text,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Address, formatUnits } from "viem";
import { useAccount } from "wagmi";

function Page() {
  const { address } = useAccount();

  const { data } = useQuery({
    queryKey: ["miner", address],
    queryFn: async () => {
      const data = (await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/minerInfo?miner=${address}`
      ).then((res) => res.json())) as {
        MinerInfos: {
          Miner: Address;
          Subnet: Address;
        };
      };

      return data.MinerInfos;
    },
  });

  const { data: rewards } = useQuery({
    queryKey: ["rewards", "miner", address],
    queryFn: async () => {
      const data = (await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/minerReward?miner=${address}?subnet=${subnetContractAddress}`
      ).then((res) => res.json())) as {
        MinerRewards:
          | {
              Miner: Address;
              Subnet: Address;
              Epoch: number;
              Reward: string;
            }[]
          | null;
      };

      return data?.MinerRewards?.map((item) => {
        return {
          ...item,
          Reward: formatUnits(BigInt(item.Reward), 18),
        };
      }) ?? [];
    },
  });

  const isRegistered = useMemo(() => data === null, [data]);

  const { registerMinerInfo } = useRegisterMinerInfo();
  const { withdrawMinerReward } = useWithdrawMinerReward();

  return (
    <main className="flex flex-col items-center pt-10">
      <Heading>Miner</Heading>
      <div>
        <Card size="4" mt="5">
          <div className="grid grid-cols-[1fr,max-content,max-content] gap-3 w-[450px]">
            <Heading size="3" weight="medium">
              NetID
            </Heading>
            <div className="italic">SN1</div>

            <Heading size="3" weight="medium" className="col-start-1">
              Register
            </Heading>
            <Button disabled={!isRegistered} onClick={registerMinerInfo}>
              Confirm
            </Button>
            <Text color="gray" className="italic">
              {String(Boolean(data))}
            </Text>
            <Text color="gray" mt="3" className="col-span-3">
              Task : 持有代币地址/地址即可获得奖励，根据给定的公式
            </Text>
          </div>
        </Card>

        <TableRoot className="mt-10">
          <TableHeader>
            <TableRow>
              <TableColumnHeaderCell>Epoch</TableColumnHeaderCell>
              <TableColumnHeaderCell>Reward(tao)</TableColumnHeaderCell>
              <TableColumnHeaderCell>Claim</TableColumnHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards?.map((reward) => (
              <TableRow key={reward.Epoch}>
                <TableCell>{reward.Epoch}</TableCell>
                <TableCell>{reward.Reward}</TableCell>
                <TableCell>
                  <Button onClick={() => withdrawMinerReward(reward.Epoch)}>
                    Claim
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </div>
    </main>
  );
}

export default Page;
