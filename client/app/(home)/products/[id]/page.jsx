'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCart,
  Package,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Clock,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { toggleCart, addToCart, addToWishlist, removeFromWishlist } from '@/app/redux/slices/cartSlice';
import { fetchProducts } from '@/app/redux/slices/productsSlice';
import CartSidebar from '@/app/components/CartSidebar/CartSidebar';
import Reviews from '@/app/components/Reviews/Reviews';

export default function ProductDetail() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { items: products, status } = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
  const wishlist = cart?.wishlist || [];

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [discountEndTime] = useState(Date.now() + 24 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState('');
  const [isSticky, setIsSticky] = useState(false);

  const cartButtonRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p._id === id);
      if (found) {
        setProduct(found);
        setSelectedImage(0);
      }
    }
  }, [products, id]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = discountEndTime - Date.now();
      if (diff <= 0) {
        setTimeLeft('Offer Ended');
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [discountEndTime]);

  // Sticky Add to Cart on scroll (desktop)
  useEffect(() => {
    const handleScroll = () => {
      if (cartButtonRef.current) {
        const offset = cartButtonRef.current.getBoundingClientRect().top;
        setIsSticky(offset < 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPaymentOptions && popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPaymentOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPaymentOptions]);

  const discountedPrice = product ? Math.round(product.price * 0.8) : 0;
  const originalPrice = product?.price || 0;
  const discountPercent = 20;
  const sizes = ['S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} left in stock!`);
      return;
    }
    dispatch(addToCart({ ...product, quantity }));
    dispatch(toggleCart());
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = (method) => {
    if (!product) return;
    dispatch(addToCart({ ...product, quantity }));
    router.push(`/checkout?method=${method}`);
    setShowPaymentOptions(false);
  };

  // Open payment popup + scroll to top on mobile
  const openPaymentOptions = () => {
    setShowPaymentOptions(true);
    // Scroll to top smoothly
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (wishlist.some((item) => item._id === product._id)) {
      dispatch(removeFromWishlist(product._id));
      toast.info('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Link copied!');
  };

  const relatedProducts = product
    ? products.filter((p) => p.category === product.category && p._id !== product._id).slice(0, 6)
    : [];

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-[#9bced3]">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-red-600">Product not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fcff] via-white to-[#f0f9fb] dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Breadcrumb */}
        <nav className="hidden md:flex text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#9bced3] transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-[#9bced3] transition-colors">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-[300px]">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mt-15">
          {/* Image Section */}
          <div className="space-y-4 lg:space-y-6 ">
            <div className="relative aspect-[5/5] sm:aspect-[4/4] lg:aspect-[4/5] bg-white mt-6 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 group mx-auto max-w-[90%] sm:max-w-[85%] lg:max-w-full">
              <Image
                src={product.media[selectedImage] || '/placeholder.png'}
                alt={product.title}
                fill
                className="object-contain p-6 sm:p-8 lg:p-10 transition-transform duration-700 group-hover:scale-110"
                priority
                quality={92}
              />
            </div>

            {product.media.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-center lg:justify-start">
                {product.media.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 snap-center shadow-sm ${
                      selectedImage === idx
                        ? 'border-[#9bced3] scale-105 shadow-md'
                        : 'border-transparent hover:border-[#9bced3]/50 hover:scale-105'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} width={96} height={96} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6 lg:space-y-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#9bced3]">
                ₹{discountedPrice}
              </span>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 line-through">
                  ₹{originalPrice}
                </span>
                <span className="text-sm sm:text-base text-green-600 dark:text-green-400 font-medium">
                  Save ₹{originalPrice - discountedPrice} ({discountPercent}%)
                </span>
              </div>

              {timeLeft && timeLeft !== 'Offer Ended' && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                  <Clock size={16} />
                  Ends in: {timeLeft}
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-[#9bced3]" />
                Free Shipping
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#9bced3]" />
                Secure COD
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-[#9bced3]" />
                7-Day Returns
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-900 dark:text-white">Select Size</label>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[56px] h-12 rounded-xl border font-semibold text-base transition-all duration-300 ${
                      selectedSize === size
                        ? 'border-[#9bced3] bg-[#9bced3]/15 text-[#9bced3] shadow-md ring-1 ring-[#9bced3]/40'
                        : 'border-gray-300 dark:border-gray-600 hover:border-[#9bced3]/60 hover:bg-[#9bced3]/5'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="block text-base font-medium text-gray-900 dark:text-white">Quantity</label>
              <div className="flex items-center w-fit border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus size={20} />
                </button>
                <span className="px-8 py-4 text-xl font-bold min-w-[70px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-40"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-gradient-to-r from-[#9bced3] to-[#7db8c0] hover:brightness-110 text-white font-bold text-xl py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
                ref={cartButtonRef}
              >
                <ShoppingCart size={24} />
                Add to Cart • ₹{discountedPrice}
              </Button>

              <div className="relative flex-1">
                <Button
                  onClick={openPaymentOptions}
                  disabled={product.stock === 0}
                  className="w-full bg-gradient-to-r from-[#9bced3] to-[#7db8c0] hover:brightness-110 text-white font-bold text-xl py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Buy Now • ₹{discountedPrice}
                </Button>

                {/* === Improved Payment Options Popup === */}
                {showPaymentOptions && (
                  <>
                    {/* Overlay to close on outside click */}
                    <div
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                      onClick={() => setShowPaymentOptions(false)}
                    />

                    {/* Popup */}
                    <div
                      ref={popupRef}
                      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-[#9bced3]/30 overflow-hidden animate-pop-in"
                    >
                      <div className="relative bg-gradient-to-r from-[#9bced3] to-[#7db8c0] p-6 text-white">
                        <button
                          onClick={() => setShowPaymentOptions(false)}
                          className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
                        >
                          <X size={24} />
                        </button>
                        <h3 className="text-2xl font-bold">Choose Payment Method</h3>
                        <p className="mt-2 opacity-90">Secure & fast checkout</p>
                      </div>

                      <div className="p-6 space-y-4">
                        <button
                          onClick={() => handleBuyNow('upi')}
                          className="w-full flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800 hover:bg-[#9bced3]/10 rounded-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#9bced3]/20 flex items-center justify-center text-[#9bced3]">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                            </svg>
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-lg">UPI</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Google Pay, PhonePe, Paytm & more</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleBuyNow('card')}
                          className="w-full flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800 hover:bg-[#9bced3]/10 rounded-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#9bced3]/20 flex items-center justify-center text-[#9bced3]">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                            </svg>
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-lg">Credit / Debit Card</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, RuPay</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleBuyNow('cod')}
                          className="w-full flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800 hover:bg-[#9bced3]/10 rounded-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#9bced3]/20 flex items-center justify-center text-[#9bced3]">
                            <Package size={24} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-lg">Cash on Delivery</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Wishlist + Share */}
            <div className="flex justify-center sm:justify-start gap-10 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleWishlist}
                className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-[#9bced3] transition"
              >
                <Heart
                  size={28}
                  className={wishlist.some((w) => w._id === product._id) ? 'fill-[#9bced3] text-[#9bced3]' : ''}
                />
                <span className="text-sm font-medium">
                  {wishlist.some((w) => w._id === product._id) ? 'Wishlisted' : 'Wishlist'}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-[#9bced3] transition"
              >
                <Share2 size={28} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="mt-16 lg:mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b border-[#9bced3]/30 pb-4">
            Product Description
          </h2>
          <div
            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-lg prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-[#9bced3] hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 lg:mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Customers Also Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  href={`/products/${related._id}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="aspect-[4/5] relative bg-gray-50 dark:bg-gray-900">
                    <Image
                      src={related.media[0] || '/placeholder.png'}
                      alt={related.title}
                      fill
                      className="object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 min-h-[2.5rem] text-base lg:text-lg">
                      {related.title}
                    </h4>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xl font-bold text-[#9bced3]">
                        ₹{Math.round(related.price * 0.8)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{related.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Reviews />

        {/* Sticky Mobile Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 lg:hidden z-50 shadow-2xl border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-4 p-4 max-w-7xl mx-auto backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-[#9bced3] hover:bg-[#8ab8c0] text-white font-bold py-6 text-lg rounded-2xl shadow-xl animate-pulse-slow"
            >
              Add to Cart
            </Button>
            <Button
              onClick={openPaymentOptions}
              disabled={product.stock === 0}
              className="flex-1 bg-gradient-to-r from-[#9bced3] to-[#7db8c0] hover:brightness-110 text-white font-bold py-6 text-lg rounded-2xl shadow-xl"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      <CartSidebar products={products} />
    </div>
  );
}