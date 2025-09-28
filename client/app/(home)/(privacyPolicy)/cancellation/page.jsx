'use client';
import Head from 'next/head';
import Link from 'next/link';

export default function CancellationPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <Head>
        <title>Cancellation Policy - BabyGlam</title>
        <meta name="description" content="Easy cancellation policy for your BabyGlam orders – cancel anytime before shipment." />
      </Head>
      <header className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold">Cancellation Policy</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Cancellation Window</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You can cancel your order anytime before it ships. Once shipped, cancellations are not possible, but returns are available within 30 days.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Cancellations within 2 hours of order: Full refund instantly.</li>
            <li>After 2 hours but before shipment: Full refund within 5-7 days.</li>
            <li>Shipped orders: Use our return policy.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">How to Cancel</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li>Log in to your account or email support@babyglam.in with order number.</li>
              <li>Provide order details and reason for cancellation.</li>
              <li>Receive confirmation email within 30 minutes.</li>
            </ol>
          </div>
        </section>
        <section className="text-center">
          <Link href="/contact" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-pink-600 transition-all duration-300">
            Cancel Order
          </Link>
        </section>
      </main>
    </div>
  );
}