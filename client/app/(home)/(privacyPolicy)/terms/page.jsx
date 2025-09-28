'use client';
import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <Head>
        <title>Terms of Use - BabyGlam</title>
        <meta name="description" content="Read our Terms of Use for shopping on BabyGlam, including user responsibilities and site usage." />
      </Head>
      <header className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold">Terms of Use</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Acceptance of Terms</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            By accessing BabyGlam.in, you agree to these Terms of Use. If you do not agree, please do not use the site.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Provide accurate information during registration and checkout.</li>
            <li>Do not misuse the site or engage in fraudulent activity.</li>
            <li>Respect intellectual property and content on the site.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Site Usage</h2>
          <p className="text-gray-700 dark:text-gray-300">
            BabyGlam reserves the right to modify, suspend, or terminate the site at any time without notice.
          </p>
        </section>
        <section className="text-center">
          <Link href="/contact" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-pink-600 transition-all duration-300">
            Contact Us for Questions
          </Link>
        </section>
      </main>
    </div>
  );
}