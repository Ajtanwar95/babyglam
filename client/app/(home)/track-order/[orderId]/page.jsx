'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { 
  CheckCircle, Clock, Truck, Package, MapPin, Calendar, Phone, Mail 
} from 'lucide-react';
import API_BASE_URL from '../../../config/apiConfig';

const statusSteps = [
  { key: 'Pending', label: 'Order Placed', desc: 'We received your order', icon: Clock },
  { key: 'Processing', label: 'Processing', desc: 'Preparing your items', icon: Package },
  { key: 'Shipped', label: 'Shipped', desc: 'On the way to you', icon: Truck },
  { key: 'Delivered', label: 'Delivered', desc: 'Order successfully delivered', icon: CheckCircle },
];

export default function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/track/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading order status...</div>;
  if (error || !order) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Order not found</div>;
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);
  const estimatedDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9fb] via-white to-[#e8f4f8] py-16 px-4">
      <div className="max-w-5xl mx-auto mt-14">
        <div className="text-center mb-16">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#9bced3] to-[#7db8c0] rounded-3xl flex items-center justify-center mb-8 shadow-xl">
            <Truck size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#9bced3] to-[#7db8c0] bg-clip-text text-transparent">
            Track Your Order
          </h1>
          <p className="mt-4 text-2xl text-gray-600">Order #{order.orderId}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Timeline */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <h2 className="text-3xl font-semibold mb-12">Order Journey</h2>
              <div className="relative pl-12 space-y-16">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="relative flex gap-8">
                      {index < statusSteps.length - 1 && (
                        <div className={`absolute left-5 top-12 w-0.5 h-[calc(100%+50px)] ${isCompleted ? 'bg-[#9bced3]' : 'bg-gray-200'}`} />
                      )}
                      <div className={`w-11 h-11 rounded-2xl border-4 flex items-center justify-center z-10 transition-all ${isCompleted ? 'bg-[#9bced3] border-[#9bced3]' : 'border-gray-300'}`}>
                        <Icon size={22} className={isCompleted ? 'text-white' : 'text-gray-400'} />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-semibold ${isCurrent ? 'text-[#9bced3]' : ''}`}>{step.label}</h3>
                        <p className="text-gray-600 mt-1">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details with Images */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-9">
              <h3 className="text-2xl font-semibold mb-8">Your Items</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-6 mb-8 last:mb-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.media?.[0] || '/placeholder.png'} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-xl leading-tight">{item.title}</p>
                    <p className="text-gray-500 mt-2">Qty: {item.quantity}</p>
                    <p className="text-[#9bced3] font-semibold mt-3 text-xl">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-9">
              <h3 className="text-2xl font-semibold mb-6">Shipping Details</h3>
              <div className="space-y-4 text-gray-700">
                <p><strong>{order.address.name}</strong></p>
                <p>{order.address.line1}, {order.address.city}, {order.address.state} {order.address.zip}</p>
                <p>Phone: {order.address.phone}</p>
                <p>Email: {order.address.email}</p>
              </div>
            </div>

            <div className="text-center bg-gradient-to-br from-[#9bced3]/10 to-white rounded-3xl p-8">
              <p className="text-sm text-gray-500">Expected Delivery</p>
              <p className="text-3xl font-bold text-[#9bced3] mt-2">
                {estimatedDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}