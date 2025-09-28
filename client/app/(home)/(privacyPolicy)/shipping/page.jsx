'use client';
import Head from 'next/head';
import Link from 'next/link';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <Head>
        <title>Shipping Policy - BabyGlam</title>
        <meta name="description" content="Learn about our shipping times, rates, and policies for baby products at BabyGlam." />
      </Head>
      <header className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold">Shipping Policy</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Shipping Times</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We ship all orders within 1-2 business days from our warehouse. Standard delivery takes 3-7 business days across India. Express shipping is available in select areas for delivery in 1-3 days.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Orders placed before 2 PM IST ship the same day (Mon-Fri).</li>
            <li>Weekends and holidays may delay processing.</li>
            <li>Track your order via the email confirmation link.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Shipping Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Standard Shipping</h3>
              <p className="text-green-600 dark:text-green-400 font-bold">FREE</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Orders over ₹500</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Express Shipping</h3>
              <p className="text-gray-800 dark:text-gray-100">₹99</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">1-3 days in metros</p>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Shipping rates are calculated at checkout based on your location and order weight (baby products are lightweight!).
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Shipping Restrictions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>We ship across India via trusted partners like Delhivery and Blue Dart.</li>
            <li>Remote areas may incur additional fees (notified at checkout).</li>
            <li>Baby products are non-hazardous; no restrictions on international shipping (customs apply).</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Tracking & Delivery</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You'll receive a tracking number via email/SMS once shipped. Monitor your order in real-time.
          </p>
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-xl">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Tip: Check spam folder for tracking emails!</p>
          </div>
        </section>
        <section className="text-center">
          <Link href="/contact" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-pink-600 transition-all duration-300">
            Have Questions? Contact Us
          </Link>
        </section>
      </main>
    </div>
  );
}