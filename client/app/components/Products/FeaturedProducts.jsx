"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ShoppingCart, Package, Clock } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import CartSidebar from "../CartSidebar/CartSidebar";
import { toggleCart, addToCart } from "@/app/redux/slices/cartSlice";
import { fetchProducts } from "@/app/redux/slices/productsSlice";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
  } = useSelector((state) => state.products);

  // Countdown timer state (example: 24 hours from now)
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());

    // Countdown logic (24 hours offer example)
    const endTime = Date.now() + 24 * 60 * 60 * 1000;
    const timer = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft("Offer Ended");
        clearInterval(timer);
      } else {
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(toggleCart());
    toast.success(`${product.title} added to cart!`, {
      style: { background: "#10B981", color: "#fff" },
    });
  };

  const handleCOD = (product) => {
    dispatch(addToCart(product));
    toast.success(`Proceeding with COD for ${product.title}.`, {
      style: { background: "#10B981", color: "#fff" },
    });
    window.location.href = `/checkout?method=cod`;
  };

  // Discount calculation (20% off example – you can make it dynamic per product)
  const getDiscountedPrice = (price) => (price * 0.8).toFixed(2);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <section
        id="products"
        className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
            Featured Products
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Discover our bestsellers – limited stock!
          </p>
        </div>

        {/* Offer Countdown Banner (above products) */}
        <div className="mb-10 bg-gradient-to-r from-[#9bced3] to-[#7db8c0] text-white py-4 px-6 rounded-xl shadow-lg text-center">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Clock className="h-6 w-6 animate-pulse" />
            <p className="text-lg font-medium">
              Hurry! Up to 20% OFF ends in:{" "}
              <span className="font-bold">{timeLeft}</span>
            </p>
          </div>
        </div>

        {status === "loading" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : status === "failed" ? (
          <div className="text-center text-red-600 dark:text-red-400 py-12 text-xl">
            {error || "Failed to load products"}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12 text-xl">
            No products available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => {
              const discountedPrice = getDiscountedPrice(product.price);
              const discountPercent = 20;

              return (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                >
                  {/* Image + Discount Badge */}
                  <div className="relative">
                    <div className="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={product.media?.[0] || "/placeholder.png"}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow-lg transform rotate-[-8deg] group-hover:rotate-0 transition-transform">
                      {discountPercent}% OFF
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[3rem]">
                      {product.title}
                    </h3>

                    {/* Pricing */}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-2xl font-bold text-[#9bced3]">
                        ₹{discountedPrice}
                      </span>
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                        ₹{product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Stock warning */}
                    {product.stock < 5 && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium animate-pulse">
                        Only {product.stock} left!
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="px-5 pb-5 flex gap-3">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="flex-1 bg-[#9bced3] hover:bg-[#8ab8c0] text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handleCOD(product);
                      }}
                      variant="outline"
                      className="flex-1 border-[#9bced3] text-[#9bced3] hover:bg-[#9bced3]/10 font-medium rounded-xl transition-all duration-300"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      COD
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <CartSidebar products={products} />
    </div>
  );
};

export default FeaturedProducts;
