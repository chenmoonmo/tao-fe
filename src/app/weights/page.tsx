"use client";
import {
  TableBody,
  TableCell,
  TableColumnHeaderCell,
  TableHeader,
  TableRoot,
  TableRow,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";

function Page() {
  
  const {} = useQuery({
    queryKey: ["epoch weights"],
    queryFn: async () => {
      return {
        data: {
          epoch: 1,
          weights: [
            {
              validator: "validator1",
              stake: 100,
              mineraddress1: "mineraddress1",
              mineraddress2: "mineraddress2",
              mineraddress3: "mineraddress3",
            },
          ],
        },
      };
    },
  });

  return (
    <main className="flex flex-col items-center w-full">
      <TableRoot className="max-w-[1200px] w-full">
        <TableHeader>
          <TableRow>
            <TableColumnHeaderCell>Validator</TableColumnHeaderCell>
            <TableColumnHeaderCell>Stake(tao)</TableColumnHeaderCell>
            <TableColumnHeaderCell>mineraddress2</TableColumnHeaderCell>
            <TableColumnHeaderCell>mineraddress2</TableColumnHeaderCell>
            <TableColumnHeaderCell>mineraddress2</TableColumnHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>validator1</TableCell>
            <TableCell>100</TableCell>
            <TableCell>mineraddress2</TableCell>
            <TableCell>mineraddress2</TableCell>
            <TableCell>mineraddress2</TableCell>
          </TableRow>
        </TableBody>
      </TableRoot>
    </main>
  );
}

export default Page;
