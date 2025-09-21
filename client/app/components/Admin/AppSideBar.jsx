"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
const AppSideBar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar className="z-50 ">
      <SidebarHeader className=" border-b h-14 bg-[#cfe8e8] p-0">
        <div className="relative flex justify-center items-center px-4">
          <h1 className="text-xl sm:text-2xl  mt-3 text-[#6ca4a4] font-bold">BabyGlam</h1>

          <Button
            onClick={toggleSidebar}
            type="button"
            size="icon"
            className="absolute right-4 md:hidden"
          >
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3  bg-[#cfe8e8] ">
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className=" font-semibold px-2 py-5"
                  >
                    <Link href={menu.url}>
                      <menu.icon />
                      {menu.title}
                      {menu.submenu && menu.submenu.length > 0 && (
                        <LuChevronRight className=" ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {menu.submenu && menu.submenu.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menu.submenu.map((submenuItem, subMenuIndex) => (
                        <SidebarMenuSubItem key={subMenuIndex}>
                          <SidebarMenuSubButton asChild className="  px-2 py-5">
                            <Link href={submenuItem.url}>
                              {submenuItem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSideBar;
