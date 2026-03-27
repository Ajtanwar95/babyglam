'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Truck, Calendar, Mail, Phone, MapPin, Package, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useSearchParams } from 'next/navigation';

export default function OrderConfirmation() {
  const cart = useSelector((state) => state.cart);
  const lastOrder = cart.lastOrder || { items: [], total: 0, address: {}, paymentId: '' };
const searchParams = useSearchParams();
const orderIdFromUrl = searchParams.get('orderId');
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
      <div className="max-w-4xl mx-auto mt-16">
        {/* Hero */}
        <div className="text-center mb-12 relative">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#9bced3]/30 to-[#7db8c0]/30 rounded-full blur-2xl opacity-70 animate-pulse-slow" />
            <div className="relative inline-flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-[#9bced3] to-[#7db8c0] rounded-full shadow-2xl animate-bounce-once">
              <CheckCircle size={72} className="text-white drop-shadow-lg" />
              <Sparkles className="absolute -top-4 -right-4 text-white animate-spin-slow" size={32} />
            </div>
          </div>

          <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#9bced3] via-[#60a5fa] to-[#7db8c0] bg-clip-text text-transparent">
            Order Confirmed!
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Thank you for choosing <span className="font-semibold text-[#9bced3]">BabyGlam</span>!  
            Your order is being prepared with love and care.
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg">
          <CardContent className="p-6 sm:p-10 lg:p-12 space-y-12">
            {/* Success Info */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-4 bg-[#9bced3]/10 dark:bg-[#9bced3]/20 px-6 py-4 rounded-2xl">
                <Mail size={24} className="text-[#9bced3]" />
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Confirmation sent to <span className="font-semibold text-[#9bced3]">{lastOrder.address.email || 'your email'}</span>
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Order ID: <span className="font-mono font-bold text-[#9bced3]">{lastOrder.paymentId || 'N/A'}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Order Summary */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#9bced3]/20 flex items-center justify-center">
                    <Package size={24} className="text-[#9bced3]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
                </div>

                <div className="space-y-5 bg-gray-50/80 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  {lastOrder.items.length > 0 ? (
                    lastOrder.items.map((item) => (
                      <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0 shadow-sm">
                            <img
                              src={item.media?.[0] || '/placeholder.png'}
                              alt={item.title}
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-[#9bced3] text-lg">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No items to display
                    </p>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                      <span>Total Amount</span>
                      <span className="text-[#9bced3]">₹{lastOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address – unchanged but kept for completeness */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#9bced3]/20 flex items-center justify-center">
                    <Truck size={24} className="text-[#9bced3]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Address</h3>
                </div>

                <div className="bg-gray-50/80 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                  <p className="font-medium text-lg text-gray-900 dark:text-white flex items-start gap-3">
                    <MapPin size={22} className="text-[#9bced3] mt-1 flex-shrink-0" />
                    {lastOrder.address.name || '—'}
                  </p>

                  <div className="space-y-2 text-gray-700 dark:text-gray-300 pl-9">
                    <p>{lastOrder.address.line1 || '—'}</p>
                    <p>
                      {lastOrder.address.city}, {lastOrder.address.state} {lastOrder.address.zip}
                    </p>
                    <p>{lastOrder.address.country || 'India'}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <p className="flex items-center gap-3">
                      <Phone size={20} className="text-[#9bced3]" />
                      <span>{lastOrder.address.phone || '—'}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Mail size={20} className="text-[#9bced3]" />
                      <span>{lastOrder.address.email || '—'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info & CTA */}
            <div className="text-center space-y-8 pt-10 border-t border-gray-200 dark:border-gray-700">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[#9bced3]/10 to-[#7db8c0]/10 px-8 py-5 rounded-2xl shadow-inner">
                <Calendar size={32} className="text-[#9bced3]" />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Expected Delivery
                  </p>
                  <p className="text-xl font-bold text-[#9bced3] mt-1">
                    3–5 Business Days
                  </p>
                </div>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Track your order anytime in your account or reply to the confirmation email if you have questions.
              </p>

              <Link href="/">
                <Button className="bg-gradient-to-r from-[#9bced3] to-[#7db8c0] hover:brightness-110 text-white font-bold text-xl py-7 px-14 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 mx-auto group">
                  Continue Shopping
                  <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-12 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
      <h3 className="text-2xl font-bold mb-4">Track Your Order</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        You can track your order status anytime using this link:
      </p>
      
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl font-mono text-sm break-all mb-6">
        {`${window.location.origin}/track-order/${orderIdFromUrl || lastOrder.paymentId || lastOrder.orderId}`}
      </div>

      <Link href={`/track-order/${orderIdFromUrl || lastOrder.paymentId || lastOrder.orderId}`}>
        <Button className="bg-[#9bced3] hover:bg-[#8ab8c0] text-white font-semibold px-10 py-6 rounded-2xl text-lg">
          Track Order Status
        </Button>
      </Link>
    </div>
      </div>
    </div>
  );
}