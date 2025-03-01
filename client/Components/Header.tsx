"use client";
import { useGlobalContext } from "@/context/globalContext";
import { LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Profile from "./Profile";


function Header() {
  const pathname = usePathname();
  const { isAuthenticated } = useGlobalContext();
  return (
    <header className="px-10 py-6 bg-[#D7DEDC] text-gray-500 flex justify-between items-center">
      <Link href={"/"} className="flex items-center gap-2">
        <Image src="/logome.png" alt="logo" width={40} height={40} />
        <h1 className="font-extrabold text-2xl text-[#7263f3]">Medjobber</h1>
      </Link>
      <ul className="flex items-center gap-8">
        <li>
          <Link
            href={"/findwork"}
            className={`py-2 px-6 rounded-md ${
              pathname === "/findwork"
                ? "text-[#7263f3]  border-[#7263f3] border bg-[#7263f3]/10"
                : ""
            }`}
          >
            Find Work
          </Link>
          <Link
            href={"/myjobs"}
            className={`py-2 px-6 rounded-md ${
              pathname === "/myjobs"
                ? "text-[#7263f3] border-[#7263f3] border bg-[#7263f3]/10"
                : ""
            }`}
          >
            My Job
          </Link>
          <Link
            href={"/post"}
            className={`py-2 px-6 rounded-md ${
              pathname === "/post"
                ? "text-[#7263f3] border-[#7263f3] border bg-[#7263f3]/10"
                : ""
            }`}
          >
            Post a Job
          </Link>
        </li>
      </ul>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
         <Profile />
        ) : (
          <div className="flex items-center gap-6">
            <Link
              href={"http://localhost:8000/login"}
              className="py-2 px-6 gap-4 rounded-md flex text-white items-center  border-[#7263f3] bg-[#7263f3] border hover:bg-[#7263f3]/90 transition-all duration-200 ease-in-out"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
            <Link
              href={"http://localhost:8000/register"}
              className="py-2 px-6 rounded-md flex items-center gap-4 text-[#7263f3] border-[#7263f3] border hover:bg-[#7263f3]/10 transition-all duration-200 ease-in-out"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
