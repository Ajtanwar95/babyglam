'use client';
import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <Head>
        <title>Privacy Policy - BabyGlam</title>
        <meta name="description" content="BabyGlam's Privacy Policy explains how we collect, use, and protect your personal data." />
      </Head>
      <header className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold">Privacy Policy</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Data We Collect</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We collect personal information like name, email, address, and payment details during registration and checkout.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Usage data (e.g., pages visited, time spent).</li>
            <li>Cookies for site functionality and analytics.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">How We Use Data</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>To process orders and deliver products.</li>
            <li>For marketing (with consent).</li>
            <li>To improve site experience and security.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Data Protection</h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use SSL encryption and comply with GDPR/CCPA. You can request data deletion via support@babyglam.in.
          </p>
        </section>
        <section className="text-center">
          <Link href="/contact" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-pink-600 transition-all duration-300">
            Update Your Preferences
          </Link>
        </section>
      </main>
    </div>
  );
}