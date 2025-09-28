'use client';
import Head from 'next/head';

export default function ContactUs() {
  const contactInfo = {
    email: 'ajaytanwar01234@gmail.com',
    phone: '+91-7027979708',
    address: 'Palwal,Haryana, India - 121102',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
      <Head>
        <title>Contact Us - BabyGlam</title>
        <meta name="description" content="Get in touch with BabyGlam for support and inquiries via email, phone, or address." />
      </Head>
      <header className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-serif font-bold animate-fade-in">Contact Us</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg animate-slide-up">
          <h2 className="text-2xl font-serif font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <p className="text-gray-700 dark:text-gray-300 font-medium">Email: <a href={`mailto:${contactInfo.email}`} className="text-blue-500 hover:underline">{contactInfo.email}</a></p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
              <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <p className="text-gray-700 dark:text-gray-300 font-medium">Phone: <a href={`tel:${contactInfo.phone}`} className="text-green-500 hover:underline">{contactInfo.phone}</a></p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
              <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700 dark:text-gray-300 font-medium">Address: {contactInfo.address}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}