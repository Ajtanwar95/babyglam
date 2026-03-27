'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldCheck, Lock, CreditCard, Truck } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { clearCart, setLastOrder } from '@/app/redux/slices/cartSlice';
import API_BASE_URL from '../../config/apiConfig';

export default function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [address, setAddress] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => console.log('Razorpay script loaded');
      script.onerror = () => console.error('Failed to load Razorpay script');
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    // Basic validation
    if (!address.name || !address.email || !address.phone || !address.line1 || !address.city || !address.state || !address.zip) {
      toast.error('Please fill all required fields', {
        style: { background: '#EF4444', color: '#fff' },
      });
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order
      const response = await axios.post(`${API_BASE_URL}/payments/create-order`, {
        amount: total,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { id: razorpayOrderId } = response.data;
      setOrderId(razorpayOrderId);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: 'INR',
        name: 'BabyGlam',
        description: 'Baby Products Purchase',
        order_id: razorpayOrderId,
      handler: async (response) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

  try {
    // 1. Verify payment
    const verifyResponse = await axios.post(`${API_BASE_URL}/payments/verify-payment`, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (verifyResponse.data.success) {
      // 2. Save order to database (this was missing!)
      const saveOrderRes = await axios.post(`${API_BASE_URL}/orders`, {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        items: cart.items.map(item => ({
      _id: item._id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      stock: item.stock || 0,
      media: item.media || []          // ← Explicitly send media
    })),
        total,
        address,
      });

      // 3. Save to Redux + clear cart
      dispatch(setLastOrder({
        items: cart.items,
        total,
        address,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      }));

      // 4. Send confirmation email
      try {
        await axios.post(`${API_BASE_URL}/send-order-email`, {
          email: address.email,
          orderId: razorpay_order_id,
          orderData: {
            orderId: razorpay_order_id,
            total,
            address,
            items: cart.items,
            paymentId: razorpay_payment_id
          }
        });
      } catch (emailError) {
        console.warn("Email sending failed (non-critical):", emailError);
      }

      dispatch(clearCart());
      toast.success('Payment Successful! Order placed.', { style: { background: '#10B981', color: '#fff' } });
      router.push(`/order-confirmation?orderId=${razorpay_order_id}`);
    }
  } catch (err) {
    console.error("Payment finalization error:", err);
    toast.error("Something went wrong while saving your order.");
  }
},
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: '#9bced3', // your brand color
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || 'Payment initiation failed', {
        style: { background: '#EF4444', color: '#fff' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9fb] via-white to-[#e8f4f8] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#9bced3] to-[#7db8c0] bg-clip-text text-transparent">
            Secure Checkout
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Complete your purchase in a few easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Order Summary (2/5 width on desktop) */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-[#9bced3]/10 to-[#7db8c0]/10 pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  {/* <ShoppingCart size={28} className="text-[#9bced3]" /> */}
                  Order Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {cart.items.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Your cart is empty
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {cart.items.map((item) => (
                        <div key={item._id} className="flex gap-4">
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <Image
                              src={item.media?.[0] || '/placeholder.png'}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-lg font-semibold text-[#9bced3] mt-1">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Shipping</span>
                        <span className="text-green-600 dark:text-green-400">FREE</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white pt-4 border-t">
                        <span>Total</span>
                        <span className="text-[#9bced3]">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <ShieldCheck size={20} className="text-[#9bced3]" />
                Secure Payment
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Truck size={20} className="text-[#9bced3]" />
                Free Shipping
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                {/* <RefreshCw size={20} className="text-[#9bced3]" /> */}
                Easy Returns
              </div>
            </div>
          </div>

          {/* Right: Shipping Address & Payment (3/5 width on desktop) */}
          <div className="lg:col-span-3">
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-[#9bced3]/10 to-[#7db8c0]/10 pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <Truck size={28} className="text-[#9bced3]" />
                  Shipping Address
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 lg:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#9bced3] focus:ring-[#9bced3]/30"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#9bced3] focus:ring-[#9bced3]/30"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#9bced3] focus:ring-[#9bced3]/30"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="line1" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                      Address Line 1 *
                    </Label>
                    <Input
                      id="line1"
                      value={address.line1}
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                      className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#9bced3] focus:ring-[#9bced3]/30"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#9bced3] focus:ring-[#9bced3]/30"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                      State *
                    </Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#9bced3] focus:ring-[#9bced3]/30"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="zip" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                      ZIP Code *
                    </Label>
                    <Input
                      id="zip"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-[#9bced3] focus:ring-[#9bced3]/30"
                      required
                    />
                  </div>
                </div>

                {/* Pay Now Button */}
                <div className="pt-8">
                  <Button
                    onClick={handlePayment}
                    disabled={loading || cart.items.length === 0}
                    className="w-full bg-gradient-to-r from-[#9bced3] via-[#8ab8c0] to-[#7db8c0] hover:brightness-110 text-white font-bold text-xl py-7 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={22} />
                        Pay Securely • ₹{total.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#9bced3]" />
                      Secure Payment
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={18} className="text-[#9bced3]" />
                      Free Shipping
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile-friendly bottom padding for sticky bar if needed */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}