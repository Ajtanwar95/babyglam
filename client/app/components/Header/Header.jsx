"use client";
import { toggleCart } from "@/app/redux/slices/cartSlice";
import Image from "next/image";
import Link from 'next/link'
import { useDispatch } from "react-redux";

export default function Header() {
  const dispatch = useDispatch();
  return (
    <header className="fixed top-0 left-0 w-full bg-[#9bced3] text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between">
        
        <Link href="/">
        {/* Logo */}
        <Image className=" w-16" src="/assets/baby3.png" alt="logo" width={50} height={50} />
        </Link>

        {/* Search Bar */}
        <div className="hidden sm:block flex-1 max-w-md mx-4">
          <div className="relative border border-black rounded-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full px-4 py-2 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-[#49a1a9]"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <Image
                src="/assets/search.png"
                alt="alt"
                width={50}
                height={25}
                className="-rotate-45 p-1 hover:animate-bounce cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-x-6 flex items-center">
          {/* Wishlist */}
          <div className="relative group inline-block">
              <Image
                src="/assets/wishlist.svg"
                alt="Wishlist"
                width={35}
                height={25}
                className="inline-block cursor-pointer"
              />
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white border border-black bg-[#528185] rounded opacity-0 group-hover:opacity-100 transition">
              Wishlist
            </span>
          </div>

          {/* Account */}
          <div className="relative group inline-block">
              <Image
                src="/assets/account.svg"
                alt="Account"
                width={35}
                height={25}
                className="inline-block cursor-pointer"
              />
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white border border-black bg-[#528185] rounded opacity-0 group-hover:opacity-100 transition">
              Account
            </span>
          </div>

          {/* Cart */}
          <div className="relative group inline-block">
              <Image
                src="/assets/cart.svg"
                alt="Cart"
                width={35}
                height={25}
                className="inline-block cursor-pointer"
                 onClick={() => dispatch(toggleCart())} 
              />
            <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white border border-black bg-[#528185] rounded opacity-0 group-hover:opacity-100 transition">
              Cart
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
