"use client";
import { Address as AddressComponent } from "@/components/address";
import { subnetContractAddress } from "@/constants/contracts";
import { useRegisterValidator } from "@/hooks/use-register-validator";
import { useSetWeight } from "@/hooks/use-set-weigth";
import { useValidatorStake } from "@/hooks/use-validator-stake";
import { useWithdrawValiditorReward } from "@/hooks/use-withdraw-validator-reward";
import {
  Button,
  Heading,
  TableBody,
  TableCell,
  TableColumnHeaderCell,
  TableHeader,
  TableRoot,
  TableRow,
  TextFieldInput,
  Text,
  Card,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Address, formatUnits } from "viem";
import { useAccount } from "wagmi";

function Page() {
  const { address } = useAccount();

  const [stakes, setStakes] = useState<string>("");
  const [weights, setWeights] = useState<
    {
      minerAddress: string;
      weight: string;
    }[]
  >();

  const { data } = useQuery({
    queryKey: ["validator", address],
    queryFn: async () => {
      const data = (await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/validatorInfo?validator=${address}`
      ).then((res) => res.json())) as {
        ValidatorInfos: {
          LegalValidator: boolean;
          StakeAmount: string;
          Subnet: Address;
          Validator: Address;
        }[];
      };

      return {
        ...data.ValidatorInfos[0],
        StakeAmount: formatUnits(
          BigInt(data.ValidatorInfos[0].StakeAmount),
          18
        ),
      };
    },
  });

  const { data: rewards } = useQuery({
    queryKey: ["rewards", "validator", address, subnetContractAddress],
    queryFn: async () => {
      const data = (await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/validatorReward?validator=${address}&subnet=${subnetContractAddress}`
      ).then((res) => res.json())) as {
        ValidatorRewards:
          | {
              Miner: Address;
              Subnet: Address;
              Epoch: number;
              Reward: string;
            }[]
          | null;
      };

      return (
        data?.ValidatorRewards?.map((item) => {
          return {
            ...item,
            Reward: formatUnits(BigInt(item.Reward), 18),
          };
        }) ?? []
      );
    },
  });

  const { data: subnetStatus } = useQuery({
    queryKey: ["subent", address, subnetContractAddress],
    queryFn: async () => {
      const data = (await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subnetStatus?validator=${address}&subnet=${subnetContractAddress}`
      ).then((res) => res.json())) as {
        SubnetStatus: boolean;
        Miners: {
          Miner: Address;
          name: string;
        }[];
      };

      setWeights(
        data.Miners.map((item) => {
          return {
            minerAddress: item.Miner,
            weight: "",
          };
        })
      );

      return data;
    },
  });

  const { stake } = useValidatorStake();
  const { registerValidator } = useRegisterValidator();
  const { withdrawValiditorReward } = useWithdrawValiditorReward();

  const { setWeight } = useSetWeight();

  const [enabledRegister, enableSetWeights] = useMemo(() => {
    if (!data) return [false, false];

    const totalWeight =
      weights?.reduce((acc, item) => {
        return acc + Number(item.weight);
      }, 0) ?? 0;

    return [
      +data.StakeAmount > 0 && !data.LegalValidator,
      !subnetStatus?.SubnetStatus && totalWeight <= 10000 && totalWeight > 0,
    ];
  }, [data, subnetStatus?.SubnetStatus, weights]);

  const handleSetWeight = async () => {
    const [miner, weight] = (weights ?? []).reduce(
      (acc, item) => {
        let weight: bigint = isNaN(+item.weight)
          ? BigInt(0)
          : BigInt(+item.weight);

        return [
          acc[0].concat(item.minerAddress as Address),
          acc[1].concat(weight),
        ];
      },
      [[], []] as [Address[], bigint[]]
    );

    setWeight(miner, weight);
  };

  return (
    <main className="flex flex-col items-center justify-between pt-10">
      <Heading>Validator</Heading>
      <div>
        <Card size="4" mt="5">
          <div className="grid grid-cols-[1fr,max-content,max-content,max-content] gap-3 w-[500px]">
            <Heading size="3">NetID</Heading>
            <div className="col-start-2 flex justify-end italic">SN1</div>
            <Heading size="3" className="col-start-1">
              Stake
            </Heading>

            <TextFieldInput
              className="!w-24"
              value={stakes}
              onChange={(e) => setStakes(e.target.value)}
            />
            <Button
              disabled={!stakes}
              onClick={async () => {
                await stake(stakes);
                setStakes("");
              }}
            >
              Confirm
            </Button>
            <Text color="gray" className="italic">
              {data?.StakeAmount || "0"}
            </Text>

            {/* <Heading size="3" className="col-start-1">
              Register as a validator
            </Heading>
            <Button className="col-start-3" disabled={!enabledRegister}>
              Confirm
            </Button>
            <Text color="gray" className="italic">
              false
            </Text> */}

            <Heading size="3" className="col-start-1">
              Register as a legal verifier
            </Heading>
            <Button
              className="col-start-3"
              disabled={!enabledRegister}
              onClick={registerValidator}
            >
              Confirm
            </Button>
            <Text color="gray" className="italic">
              {data?.LegalValidator ? "true" : "false"}
            </Text>

            <Heading size="3" className="col-start-1">
              Set weights
            </Heading>
            <div className="flex justify-end col-span-2">
              {!subnetStatus?.SubnetStatus ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </div>

            {weights?.map((item, i) => {
              return (
                <>
                  <label className="col-span-2" htmlFor="weight-1">
                    <AddressComponent>{item.minerAddress}</AddressComponent>
                  </label>
                  <TextFieldInput
                    id="weight-1"
                    className="!w-24"
                    value={item.weight}
                    onChange={(e) => {
                      const newWeights = [...weights];
                      newWeights[i].weight = e.target.value;
                      setWeights(newWeights);
                    }}
                  />
                </>
              );
            })}
            <Button
              className="col-start-3"
              disabled={!enableSetWeights}
              onClick={handleSetWeight}
            >
              Submit
            </Button>
          </div>
        </Card>
        <TableRoot className="mt-5">
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
                  <Button onClick={() => withdrawValiditorReward(reward.Epoch)}>
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
