"use client"
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
} from "@/Components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { Badge } from "./ui/badge";

function Profile() {

    const router = useRouter();
    const {userProfile} = useGlobalContext();
    const {name, profilePicture, profession, email} = userProfile;
  return (
    <DropdownMenu>
        <Badge>{profession}</Badge>
      <div className="flex flex-centre gap-4">
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Image
            src={profilePicture ? profilePicture: "/avatar.png"}
            alt="avatar"
            height={36}
            width={36}
            className="rounded-full "
          />
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56" align="end" >
        <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                   {email}
                </p>
            </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4"/>
            <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => {
            router.push("http://localhost:8000/logout")
        }}>
            <LogOut className="mr-2 h-4 w-4"/>
            <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;
