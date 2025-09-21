'use client'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import UserDropDown from './UserDropDown'
import { RiMenu4Fill } from 'react-icons/ri'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

const Topbar = () => {
    const {toggleSidebar} = useSidebar()
  return (
    <div className=' fixed border  h-14 w-full top-0 left-0 z-30 md:ps-96 px-5  flex justify-between items-center bg-white dark:bg-card'>
      <div className=' md:ml-64'>
        Search compon
      </div>
      <div className='flex items-center gap-2'>
        <ThemeSwitch/>
        <UserDropDown/>
        <Button onClick={toggleSidebar} typ="button" size="icon" className="ms-2 md:hidden">
            <RiMenu4Fill/>
        </Button>
      </div>
    </div>
  )
}

export default Topbar
