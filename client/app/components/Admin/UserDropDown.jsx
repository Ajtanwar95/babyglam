import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { IoShirtOutline } from 'react-icons/io5'
import { MdOutlineShoppingBag } from 'react-icons/md'
import { LogOutIcon } from 'lucide-react'
const UserDropDown = () => {
  return (
    <DropdownMenu>
  <DropdownMenuTrigger  asChild>
    <Avatar className=" cursor-pointer">
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="cursor-pointer me-5 w-44">
    <DropdownMenuLabel>
      <p className='font-semibold '>Ajay</p>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Link href={"/admin/profile"}>
      <IoShirtOutline/>
      New Product
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Link href={"/admin/profile"}>
      <MdOutlineShoppingBag/>
      Orders
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Link href={"/admin/profile"}>
      <LogOutIcon/>
      Logout
      </Link>
    </DropdownMenuItem>
 
    
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default UserDropDown
