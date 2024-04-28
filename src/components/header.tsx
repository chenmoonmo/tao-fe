"use client";
import { ConnectKitButton } from "connectkit";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navs = [
  {
    name: "Miner",
    href: "/",
  },
  {
    name: "Validator",
    href: "/validator",
  },
  {
    name: "Weights",
    href: "/weights",
  },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between h-20 px-5">
      <div className="flex items-center">
        <div className="ml-[30px] flex items-center gap-[42px]">
          {Navs.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                pathname === item.href ? "text-white" : "text-secondary"
              } font-medium hover:text-white`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ConnectKitButton />
      </div>
    </header>
  );
};
