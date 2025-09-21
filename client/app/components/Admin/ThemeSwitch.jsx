'use client'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5'
import { useTheme } from 'next-themes'
const ThemeSwitch = () => {
    const {setTheme} = useTheme()
    
  return (
    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button type="button" variant="ghost" className="cursor-pointer">
        <IoSunnyOutline className=' dark:hidden'/>
        <IoMoonOutline className=' hidden dark:block'/>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className= "cursor-pointer">
    <DropdownMenuLabel onClick={()=>setTheme('light')}>Light</DropdownMenuLabel>
    <DropdownMenuLabel onClick={()=>setTheme('dark')}>Dark</DropdownMenuLabel>
    <DropdownMenuLabel onClick={()=>setTheme('system')}>System</DropdownMenuLabel>
    
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default ThemeSwitch
