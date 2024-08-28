"use client";

import { links } from "@/lib/constant/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineEllipsisHorizontalCircle
} from "react-icons/hi2";

export default function Sidebar({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {

  const pathname = usePathname();

  return (
    <div className="flex flex-col py-6 px-4 justify-between h-screen">
      <div className="flex flex-col gap-4 font-medium">
        <Link href="/" className="mb-4 ml-2">
          <Image
            src="/images/newLogo.png"
            alt="logo"
            width={35}
            height={35}
            className="cursor-pointer"
          />
        </Link>
        <div className="flex flex-col gap-1 text-slate-400">
          {links.map((link, index) => {
            return (
              <Link
                href={link.path}
                key={index}
                className={cn(
                  "w-full flex items-center p-2 hover:bg-gray-100 rounded-full transition-all duration-200 gap-4",
                  link.path === pathname &&
                    "text-black bg-gray-100 border-b-2 border-accent"
                )}
              >
                {link.icon}
                <span className="hidden xl:inline">{link.name}</span>
              </Link>
            );
          })}

          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="w-full flex items-center p-2 hover:bg-gray-100 rounded-full transition-all duration-200 gap-4"
          >
            <HiOutlineEllipsisHorizontalCircle className="w-7 h-7" />
            <span className="hidden xl:inline">더</span>
          </button>
        </div>
      </div>
    </div>
  );
}
