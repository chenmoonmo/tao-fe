"use client";
import { Address } from "@/components/address";
import { subnetContractAddress } from "@/constants/contracts";
import {
  TableBody,
  TableCell,
  TableColumnHeaderCell,
  TableHeader,
  TableRoot,
  TableRow,
} from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// 原始数据结构类型定义
type OriginalData = {
  Validator: string;
  Subnet: string;
  Epoch: number;
  Miner: string;
  Weight: number;
}[];

// 目标数据结构类型定义
type TargetData = {
  Validator: string;
  Epoch: number;
  [key: string]: number | string; // 允许任意键对应数值
};

function Page() {
  const { data } = useQuery({
    queryKey: ["epoch weights", subnetContractAddress],
    queryFn: async () => {
      const data = (await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subnetWeights?subnet=${subnetContractAddress}`
      ).then((res) => res.json())) as {
        ValidatirWeight: OriginalData;
      };

      return data.ValidatirWeight.reduce(
        (accumulator: TargetData[], currentValue: OriginalData[number]) => {
          // 查找是否已存在相同validator和subnet的条目
          const existingEntry = accumulator.find(
            (entry) =>
              entry.Validator === currentValue.Validator &&
              entry.Subnet === currentValue.Subnet &&
              entry.Epoch === currentValue.Epoch
          );

          if (existingEntry) {
            // 如果找到，则直接在该条目下添加新的miner和weight
            existingEntry[currentValue.Miner] = currentValue.Weight;
          } else {
            // 如果没有找到，则创建一个新的条目
            const newEntry: TargetData = {
              Validator: currentValue.Validator,
              Subnet: currentValue.Subnet,
              Epoch: currentValue.Epoch,
            };
            newEntry[currentValue.Miner] = currentValue.Weight;
            accumulator.push(newEntry);
          }

          return accumulator;
        },
        []
      );
    },
  });

  const columns = useMemo(() => {
    if (!data) return [];
    return Object.keys(data[0]);
  }, [data]);

  return (
    <main className="flex flex-col items-center w-full">
      <TableRoot className="max-w-[1200px] w-full">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableColumnHeaderCell key={column}>
                {column.length === 42 ? <Address>{column}</Address> : column}
              </TableColumnHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            // 遍历数据，渲染表格
            data?.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {String(row[column]).length === 42 ? (
                      <Address>{String(row[column])}</Address>
                    ) : (
                      row[column]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          }
        </TableBody>
      </TableRoot>
    </main>
  );
}

export default Page;
