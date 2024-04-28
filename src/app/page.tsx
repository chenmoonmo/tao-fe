"use client";
import { Button, Heading, Table } from "@radix-ui/themes";
import NoSSR from "react-no-ssr";

function Page() {
  return (
    <main className="flex flex-col items-center pt-20">
      <Heading>Miner</Heading>
      <div className="flex flex-col gap-5 w-[450px] mt-10">
        <div className="flex items-center gap-10">
          <Heading size="3" weight="medium">
            NetID
          </Heading>
          <div>1</div>
        </div>
        <div className="flex items-center gap-10">
          <Heading size="3" weight="medium">
            Register
          </Heading>
          <Button>Confirm</Button>
        </div>
        <div>Task : 持有代币地址/地址即可获得奖励，根据给定的公式</div>
      </div>
      <Table.Root className="w-[450px] mt-2">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Epoch</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Reward(tao)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Claim</Table.ColumnHeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>100</Table.Cell>
            <Table.Cell>
              <Button>Claim</Button>
            </Table.Cell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </main>
  );
}

export default Page;
