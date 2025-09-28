'use client';
import Head from 'next/head';
import Link from 'next/link';

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <Head>
        <title>Return & Replacement Policy - BabyGlam</title>
        <meta name="description" content="Our 30-day return policy for baby products ensures hassle-free exchanges if not satisfied." />
      </Head>
      <header className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold">Return & Replacement Policy</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Return Window</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We offer a 30-day return window from the date of delivery. If you're not thrilled with your baby product, return it for a full refund or exchange.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Returns must be in original condition with tags and packaging.</li>
            <li>Hygiene items (e.g., diapers, bottles) are non-returnable once opened.</li>
            <li>Contact support within 7 days for return authorization.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Replacement Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">For Defects</h3>
              <p className="text-green-600 dark:text-green-400 font-bold">FREE Replacement</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Within 7 days of delivery</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Size/Color Wrong</h3>
              <p className="text-gray-800 dark:text-gray-100">₹99 Fee</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Exchange only (same value)</p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Email photos of the issue to support@babyglam.in for quick approval.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Refund Process</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Refunds processed within 5-7 business days to original payment method.</li>
            <li>Return shipping is customer-paid unless defective (we cover).</li>
            <li>Track refunds via your order history.</li>
          </ul>
        </section>
        <section className="text-center">
          <Link href="/contact" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-pink-600 transition-all duration-300">
            Need Help? Contact Support
          </Link>
        </section>
      </main>
    </div>
  );
}