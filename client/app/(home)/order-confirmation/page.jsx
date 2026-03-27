import OrderConfirmationContent from '@/app/components/order-confirmation/OrderConfirmationContent';
import { Suspense } from 'react';

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading order confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}