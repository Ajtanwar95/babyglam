'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import axios from 'axios';
import { clearCart } from '@/app/redux/slices/cartSlice';
import API_BASE_URL  from '../../config/apiConfig';
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

  const calculateTotal = () => cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (!address.name || !address.email || !address.phone || !address.line1) {
      toast.error('Please fill all required address fields', { style: { background: '#EF4444', color: '#fff' } });
      return;
    }

    setLoading(true);
    try {
      console.log('Creating order with amount:', calculateTotal());
      const response = await axios.post(`${API_BASE_URL}/payments/create-order`, {
        amount: calculateTotal(),
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { id: order_id } = response.data;
      setOrderId(order_id);
      console.log('Order created:', order_id);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: calculateTotal() * 100, // Amount in paise
        currency: 'INR',
        name: 'BabyGlam',
        description: 'Baby Products Purchase',
        order_id: order_id,
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          const verifyResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/payments/verify-payment`, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          });

          if (verifyResponse.data.success) {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/orders`, {
              items: cart.items,
              total: calculateTotal(),
              address,
              paymentId: razorpay_payment_id,
            });
            dispatch(clearCart());
            toast.success('Payment Successful!', { style: { background: '#10B981', color: '#fff' } });
            router.push('/order-confirmation');
          } else {
            toast.error('Payment verification failed', { style: { background: '#EF4444', color: '#fff' } });
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: '#F472B6',
        },
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error.response ? error.response.data : error.message);
      toast.error(`Payment Failed: ${error.response ? error.response.data.error : error.message}`, { style: { background: '#EF4444', color: '#fff' } });
    }
    setLoading(false);
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif text-center mb-8">Checkout</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between mb-2">
                <span>{item.title} (x{item.quantity})</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="line1">Address Line 1 *</Label>
              <Input id="line1" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input id="state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input id="zip" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} required />
            </div>
          </CardContent>
        </Card>
        <div className="mt-8">
          <Button
            onClick={handlePayment}
            disabled={loading || cart.items.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-pink-600 transition-all duration-300"
          >
            {loading ? 'Processing...' : 'Pay Now with Razorpay'}
          </Button>
        </div>
      </div>
    </div>
  );
}