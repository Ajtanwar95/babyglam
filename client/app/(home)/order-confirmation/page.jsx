'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Truck, Calendar, Mail, Phone, MapPin, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function OrderConfirmation() {
  const cart = useSelector((state) => state.cart);
  const lastOrder = cart.lastOrder || { items: [], total: 0, address: {}, paymentId: '' };

  // Launch confetti on page load
  useEffect(() => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9bced3', '#7db8c0', '#ffffff', '#60a5fa'],
      });
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9bced3', '#7db8c0', '#ffffff', '#60a5fa'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9fb] via-[#e8f4f8] to-[#d9eff3] dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Celebration */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#9bced3] to-[#7db8c0] rounded-full shadow-2xl mb-6 animate-bounce-once">
            <CheckCircle size={56} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#9bced3] to-[#60a5fa] bg-clip-text text-transparent mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Thank you for shopping with BabyGlam! Your order is being prepared with love.
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
          <CardContent className="p-6 sm:p-10 space-y-10">
            {/* Success Message */}
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                A confirmation email has been sent to <span className="font-semibold text-[#9bced3]">{lastOrder.address.email || 'your email'}</span>.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Order ID: <span className="font-mono font-medium text-[#9bced3]">{lastOrder.paymentId || 'N/A'}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Package size={28} className="text-[#9bced3]" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Order Summary</h3>
                </div>

                <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                  {lastOrder.items.length > 0 ? (
                    lastOrder.items.map((item) => (
                      <div key={item._id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-gray-700 flex-shrink-0">
                            <Image
                              src={item.media?.[0] || '/placeholder.png'}
                              alt={item.title}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-[#9bced3]">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                      No items to display
                    </p>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span className="text-[#9bced3]">₹{lastOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Truck size={28} className="text-[#9bced3]" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Shipping Address</h3>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl space-y-3">
                  <p className="font-medium text-gray-900 dark:text-white flex items-start gap-2">
                    <MapPin size={20} className="text-[#9bced3] mt-1 flex-shrink-0" />
                    {lastOrder.address.name || '—'}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 pl-7">
                    {lastOrder.address.line1 || '—'}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 pl-7">
                    {lastOrder.address.city}, {lastOrder.address.state} {lastOrder.address.zip}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 pl-7">
                    {lastOrder.address.country || 'India'}
                  </p>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Phone size={18} className="text-[#9bced3]" />
                      {lastOrder.address.phone || '—'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2 mt-2">
                      <Mail size={18} className="text-[#9bced3]" />
                      {lastOrder.address.email || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info & CTA */}
            <div className="text-center space-y-6 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="inline-flex items-center gap-3 bg-[#9bced3]/10 dark:bg-[#9bced3]/20 px-6 py-4 rounded-2xl">
                <Calendar size={24} className="text-[#9bced3]" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Expected Delivery: <span className="font-bold">3–5 business days</span>
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Track your order in your account or check your email for updates.
              </p>

              <Link href="/">
                <Button className="bg-gradient-to-r from-[#9bced3] to-[#7db8c0] hover:brightness-110 text-white font-bold text-xl py-7 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto">
                  Continue Shopping
                  <ArrowRight size={24} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}