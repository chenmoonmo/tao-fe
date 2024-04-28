
"use client";
import {
  TableBody,
  TableCell,
  TableColumnHeaderCell,
  TableHeader,
  TableRoot,
  TableRow,
} from "@radix-ui/themes";

function Page() {
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
