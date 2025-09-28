import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-[#3f9c9c] to-[#2e6e6e] text-white mt-16 overflow-hidden">
      {/* Decorative wave (optional) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#ffffff22"
            fillOpacity="1"
            d="M0,64L48,96C96,128,192,192,288,202.7C384,213,480,171,576,133.3C672,96,768,64,864,80C960,96,1056,160,1152,160C1248,160,1344,96,1392,64L1440,32V0H0Z"
          ></path>
        </svg>
      </div>

      {/* Top Section */}
      <div className="relative container mx-auto px-6 pt-16 pb-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-extrabold tracking-wide mb-4">BabyGlam</h2>
          <p className="text-sm leading-relaxed opacity-90 max-w-xs">
            Premium baby products, toys & women’s beauty essentials. 
            Quality and care delivered with love.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-6">
            {["facebook", "instagram", "twitter", "youtube"].map((icon) => (
              <Link key={icon} href="#">
                <Image
                  src={`/assets/${icon}.svg`}
                  alt={icon}
                  width={32}
                  height={32}
                  className="cursor-pointer hover:scale-125 hover:rotate-6 transition-transform duration-300"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-5 relative after:content-[''] after:block after:w-12 after:h-[2px] after:bg-white after:mt-2">
            Useful Links
          </h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Home", link: "/" },
              { name: "About", link: "/about" },
              { name: "Returns Policy", link: "/returns" },
              { name: "Shipping", link: "/shipping" },
              { name: "Privacy Policy", link: "/privacy" },
              // { name: "Cancellation", link: "/cancellation" },
              { name: "Contact Us", link: "/contact" },
              { name: "Terms and Conditions", link: "/terms" },
            ].map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  className="relative group hover:text-gray-200 transition duration-300"
                >
                  {item.name}
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-semibold mb-5 relative after:content-[''] after:block after:w-12 after:h-[2px] after:bg-white after:mt-2">
            Payment Methods
          </h3>
          <p className="text-sm mb-4 opacity-80">
            100% secure payments with trusted methods
          </p>
          <div className="flex flex-wrap gap-5">
            {["upi2", "visa1", "mastercard1", "bank3"].map((method) => (
              <Image
                key={method}
                src={`/assets/${method}.svg`}
                alt={method}
                width={50}
                height={50}
                className="hover:scale-125 hover:-rotate-6 transition-transform duration-300"
              />
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-5 relative after:content-[''] after:block after:w-12 after:h-[2px] after:bg-white after:mt-2">
            Newsletter
          </h3>
          <p className="text-sm mb-4 opacity-80">
            Get exclusive offers, style tips, and updates.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border-amber-200 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffffff80]"
            />
            <button
              type="submit"
              className="bg-white text-[#2e6e6e] px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#2b5f5f] py-5 text-center text-sm opacity-90">
        <p>
          &copy; {new Date().getFullYear()} <span className="font-semibold">BabyGlam</span>.  
          All rights reserved. | Made by Ajay Kumar
        </p>
      </div>

      {/* Floating support button */}
      <Link
        href="https://wa.me/7027979708"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Image src="/assets/whatsapp.svg" alt="WhatsApp" width={28} height={28} />
      </Link>
    </footer>
  );
}
