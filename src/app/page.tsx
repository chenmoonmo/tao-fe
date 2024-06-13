"use client";
import { subnetContractAddress } from "@/constants/contracts";
import { useRegisterMinerInfo } from "@/hooks/use-register-minerInfo";
import { useSubmit } from "@/hooks/use-submit";
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
  TextField,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Address, formatUnits } from "viem";
import { useAccount } from "wagmi";
import dayjs from "dayjs";
import { formatAmount } from "@/utils/format";
import { Toaster } from "react-hot-toast";

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
        `${process.env.NEXT_PUBLIC_API_URL}/minerReward?miner=${address}&subnet=${subnetContractAddress}`
      ).then((res) => res.json())) as {
        RewardInfo:
          | {
              Miner: Address;
              Subnet: Address;
              Epoch: number;
              Reward: string;
            }[]
          | null;
      };

      return (
        data?.RewardInfo?.map((item) => {
          return {
            ...item,
            Reward: formatUnits(BigInt(item.Reward), 18),
          };
        }).sort((i, j) => i.Epoch - j.Epoch) ?? []
      );
    },
  });

  const isRegistered = useMemo(() => data === null, [data]);

  const { registerMinerInfo } = useRegisterMinerInfo();
  const { withdrawMinerReward } = useWithdrawMinerReward();
  const { value, setValue, submitHandler } = useSubmit();

  // 获得一个时间字符串 如果没到 01:00:00 则为今天的 01:00:00 ，否则为明天的 01:00:00
  const getTimestamp = () => {
    const datetimeObj = new Date();
    const hour = datetimeObj.getUTCHours();
    const minute = datetimeObj.getMinutes();
    const second = datetimeObj.getSeconds();
    const today = new Date(
      datetimeObj.getFullYear(),
      datetimeObj.getMonth(),
      datetimeObj.getDate(),
      1,
      0,
      0
    ).getTime();
    const tomorrow = new Date(
      datetimeObj.getFullYear(),
      datetimeObj.getMonth(),
      datetimeObj.getDate() + 1,
      1,
      0,
      0
    );

    return dayjs(
      hour < 1 || (hour === 1 && minute === 0 && second === 0)
        ? today
        : tomorrow
    ).format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <main className="flex flex-col items-center pt-10">
      <Toaster
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <Heading>Miner</Heading>
      <div>
        <Card size="4" mt="5">
          <div className="grid grid-cols-[1fr,max-content,max-content] gap-5 w-[450px] items-center">
            <Heading size="3" weight="medium" className="col-start-1">
              Register
            </Heading>
            <Button
              className="w-[80px]"
              disabled={!isRegistered}
              onClick={registerMinerInfo}
            >
              Confirm
            </Button>
            <Text color="gray" className="italic">
              {String(Boolean(data))}
            </Text>

            <Heading size="3" weight="medium" className="col-start-1">
              Price($)
            </Heading>
            <TextField.Root className="w-[120px]">
              <TextField.Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </TextField.Root>
            <Button className="w-[80px]" onClick={submitHandler}>
              Submit
            </Button>

            <Text color="gray" className="col-start-2 col-span-2">
              Predict the price on <Text weight="medium">{getTimestamp()}</Text>
            </Text>
          </div>
        </Card>

        <Heading size="4" mt="3">
          Record
        </Heading>
        <TableRoot className="mt-3">
          <TableHeader>
            <TableRow>
              <TableColumnHeaderCell>Epoch</TableColumnHeaderCell>
              <TableColumnHeaderCell>Reward(tao)</TableColumnHeaderCell>
              <TableColumnHeaderCell></TableColumnHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards?.map((reward) => (
              <TableRow key={reward.Epoch}>
                <TableCell>{reward.Epoch}</TableCell>
                <TableCell>{formatAmount(reward.Reward)}</TableCell>
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
