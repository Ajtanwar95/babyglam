'use client';
import Head from 'next/head';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <Head>
        <title>About Us - BabyGlam</title>
        <meta name="description" content="Learn about BabyGlam, your trusted partner in baby care products with love and quality." />
      </Head>
      <header className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold animate-fade-in">About Us</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center animate-slide-up">Our Story</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4 animate-fade-in-delay">
            BabyGlam was born out of a passion for nurturing little ones with the best care. Founded in 2025, we aim to bring premium, safe, and eco-friendly baby products to every home. Our journey began with a simple idea: to make parenting easier and more joyful with quality essentials.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed animate-fade-in-delay delay-100">
            From diapers to toys, every product is crafted with love, tested for safety, and designed to bring smiles to babies and peace to parents.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center animate-slide-up">Our Mission</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg animate-zoom-in">
            <p className="text-gray-700 dark:text-gray-300 text-center">
              To provide affordable, high-quality baby products that prioritize safety, sustainability, and parental trust.
            </p>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center animate-slide-up">Our Vision</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4 animate-fade-in-delay">
            To become India’s most loved baby care brand, expanding globally while staying true to our roots of care and innovation.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center animate-slide-up">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Ajay Tanwar</h3>
              <p className="text-gray-600 dark:text-gray-400">Founder & CEO</p>
              {/* <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">A mother of two, driving BabyGlam with 10+ years in childcare innovation.</p> */}
            </div>
            {/* <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in delay-100">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">Rohit Kumar</h3>
              <p className="text-gray-600 dark:text-gray-400">Product Designer</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Expert in eco-friendly baby product design with a focus on safety.</p>
            </div> */}
          </div>
        </section>
      </main>
    </div>
  );
}