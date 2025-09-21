"use client";
import Image from "next/image";

export default function Banner() {
  return (
    <section className="relative mt-18 w-full h-[150px] md:h-[500px] ">
      {/* Banner Background */}
      <Image
        src="/assets/Baby Glam.png"
        alt="BabyGlam Banner"
        fill
        priority
        className="object-fill w-full h-full"
      />

    
    </section>
  );
}
