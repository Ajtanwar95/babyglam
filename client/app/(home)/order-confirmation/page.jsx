'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderConfirmation() {
  const cart = useSelector((state) => state.cart);
  const lastOrder = cart.lastOrder || { items: [], total: 0, address: {}, paymentId: '' };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-serif text-green-600 dark:text-green-400 flex items-center justify-center">
              <CheckCircle size={40} className="mr-2" /> Order Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 py-8">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Thank you for your purchase! Your order has been successfully processed. We’ll send you a confirmation email with the details shortly.
            </p>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Order Summary</h3>
              {lastOrder.items.length > 0 ? (
                <>
                  {lastOrder.items.map((item) => (
                    <div key={item._id} className="flex justify-between mb-2">
                      <span>{item.title} (x{item.quantity})</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{lastOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Payment ID: {lastOrder.paymentId}
                  </p>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No items to display (order details cleared).</p>
              )}
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Shipping Address</h3>
              <p className="text-gray-700 dark:text-gray-300">{lastOrder.address.name}</p>
              <p className="text-gray-700 dark:text-gray-300">{lastOrder.address.line1}</p>
              <p className="text-gray-700 dark:text-gray-300">{lastOrder.address.city}, {lastOrder.address.state} - {lastOrder.address.zip}</p>
              <p className="text-gray-700 dark:text-gray-300">{lastOrder.address.country}</p>
              <p className="text-gray-700 dark:text-gray-300">Phone: {lastOrder.address.phone}</p>
              <p className="text-gray-700 dark:text-gray-300">Email: {lastOrder.address.email}</p>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Your order will be shipped to the provided address. Expect delivery within 3-5 business days.
            </p>

            <Link href="/" passHref>
              <Button className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-pink-600 transition-all duration-300">
                Continue Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}