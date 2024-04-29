"use client";
import {
  Text,
  HoverCard,
  Flex,
  IconButton,
  Tooltip,
  Link,
} from "@radix-ui/themes";
import { memo, useCallback, useMemo, useState } from "react";

enum ETHSCANKLINKS {
  token = "https://etherscan.io/token/",
  address = "https://etherscan.io/address/",
  tx = "https://etherscan.io/tx/",
}

type AddressProps = {
  children: string;
  type?: "token" | "address" | "tx";
  extra?: "pool" | "address" | "contract";
  className?: string;
};

export const Address = memo(
  ({ children, type = "address", className }: AddressProps) => {
    const [copied, setCopied] = useState(false);

    const [head, tail] = useMemo(
      () => [children?.slice(0, 6), children?.slice(-4)],
      [children]
    );

    const handleCopy = useCallback(() => {
      try {
        navigator.clipboard.writeText(children);
      } catch {
        const input = document.createElement("input");
        input.value = children;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
    }, [children]);

    return (
      <HoverCard.Root
        onOpenChange={() => {
          setCopied(false);
        }}
      >
        <HoverCard.Trigger>
          <Text className={className}>
            {head}...{tail}
          </Text>
        </HoverCard.Trigger>
        <Flex asChild direction="column" align="start">
          <HoverCard.Content size="1">
            <Flex gap="2">
              <Tooltip content="Copy Address">
                <IconButton
                  variant="soft"
                  size="2"
                  color={copied ? "green" : "gray"}
                  onClick={handleCopy}
                >
                  {!copied ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-[#A9B6BA] group-hover:fill-white"
                    >
                      <path d="M10.8463 0C11.454 0 11.9575 0.471638 11.9976 1.07822L12.0003 1.15394V7.98486C12 8.59252 11.5284 9.09607 10.922 9.13583L10.8463 9.1388H9.69238V10.8463C9.69265 11.438 9.24535 11.934 8.65662 11.9946L8.53843 12.0003H1.15394C0.516801 12 0 11.4832 0 10.8463V3.46156C0 2.82469 0.516801 2.30762 1.15394 2.30762L2.86147 2.30681V1.15394C2.86174 0.546008 3.33338 0.0427287 3.93969 0.00270435L4.01541 0L10.8463 0ZM8.30775 3.69252H1.38463V10.6156H8.30775V3.69252ZM10.6156 1.38463H4.2461V2.30681L8.53843 2.30762C9.13556 2.30762 9.62775 2.76168 9.6867 3.34338L9.69211 3.46156V7.7539H10.6154V1.38463H10.6156Z" />
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
                        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip content="To Etherscan">
                <IconButton asChild variant="soft" color="gray" size="2">
                  <Link
                    href={`${ETHSCANKLINKS[type]}${children}`}
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      className="fill-[#A9B6BA] group-hover:fill-white"
                    >
                      <path d="M4.75912 9.38983L3.68899 10.4288C3.10459 11.0126 2.15705 11.0126 1.57265 10.4288C0.988253 9.84498 0.988253 8.8984 1.57265 8.3146L4.31785 5.56637C4.87745 5.00557 5.77894 4.98151 6.36759 5.51204L6.44004 5.57239C6.67883 5.80598 7.06199 5.80191 7.29564 5.56336C7.5293 5.32481 7.52522 4.94222 7.28661 4.70863C7.25242 4.66457 7.2161 4.62209 7.17784 4.58175C6.10683 3.65074 4.49659 3.70897 3.49555 4.71465L0.714035 7.46306C-0.267875 8.53085 -0.232977 10.1821 0.793395 11.2074C1.81977 12.2327 3.4727 12.2676 4.54158 11.2867L5.58762 10.2658C5.80179 10.0322 5.79913 9.67315 5.58142 9.44292C5.36353 9.21251 5.00464 9.18933 4.75912 9.38983ZM11.2229 0.78837C10.1641 -0.26279 8.45434 -0.26279 7.39555 0.78837L6.34952 1.80927C6.13517 2.04268 6.13783 2.40192 6.35572 2.63215C6.5736 2.86238 6.9325 2.88556 7.17784 2.68506L8.22388 1.64611C8.80828 1.06231 9.75582 1.06231 10.34 1.64611C10.9244 2.22991 10.9244 3.17648 10.34 3.76028L7.59502 6.50852C7.03542 7.06949 6.13393 7.09338 5.54528 6.56285L5.47265 6.5025C5.23386 6.26891 4.85088 6.27298 4.61705 6.51153C4.38322 6.75007 4.38729 7.13267 4.62608 7.36626C4.67001 7.41121 4.71643 7.4535 4.76514 7.49314C5.83722 8.42113 7.44515 8.36309 8.44743 7.36024L11.1985 4.61183C12.2576 3.56085 12.2684 1.8528 11.2229 0.78837Z" />
                    </svg>
                  </Link>
                </IconButton>
              </Tooltip>
            </Flex>
            <div className="mt-[6px] pt-2 border-[#424647] border-t-2 text-sm text-white">
              {children}
            </div>
          </HoverCard.Content>
        </Flex>
      </HoverCard.Root>
    );
  }
);

Address.displayName = "Address";
