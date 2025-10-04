'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShoppingCart,
  Package,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { toggleCart, addToCart, addToWishlist, removeFromWishlist } from '@/app/redux/slices/cartSlice';
import { fetchProducts } from '@/app/redux/slices/productsSlice';
import CartSidebar from '@/app/components/CartSidebar/CartSidebar';
import Reviews from '@/app/components/Reviews/Reviews';

const ProductDetail = () => {
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
  const [discountEndTime] = useState(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(0);
      } else {
        setProduct(null);
      }
    }
  }, [products, id]);

  useEffect(() => {
    if (discountEndTime) {
      const timer = setInterval(() => {
        const timeRemaining = Math.max(0, discountEndTime - Date.now());
        setTimeLeft(timeRemaining);
        if (timeRemaining <= 0) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [discountEndTime]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} in stock!`, { style: { background: '#EF4444', color: '#fff' } });
      return;
    }
    dispatch(addToCart({ ...product, quantity }));
    dispatch(toggleCart());
    toast.success(`${product.title} added to cart!`, { style: { background: '#10B981', color: '#fff' } });
  };

  const handleBuyNow = (method) => {
    if (!product) return;
    dispatch(addToCart({ ...product, quantity })); // Add to cart first
    toast.success(`Proceeding to ${method === 'cod' ? 'Cash on Delivery' : method} Checkout`, {
      style: { background: '#10B981', color: '#fff' },
    });
    // Redirect to checkout with method parameter
    router.push(`/checkout?method=${method}`);
    setShowPaymentOptions(false);
  };

  const handleWishlist = () => {
    if (!product) return;
    if (wishlist.some((item) => item._id === product._id)) {
      dispatch(removeFromWishlist(product._id));
      toast.info(`${product.title} removed from wishlist`, { style: { background: '#3B82F6', color: '#fff' } });
    } else {
      dispatch(addToWishlist(product));
      toast.success(`${product.title} added to wishlist`, { style: { background: '#10B981', color: '#fff' } });
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.info('Link copied to clipboard!', { style: { background: '#3B82F6', color: '#fff' } });
  };

  const relatedProducts = product
    ? products.filter((p) => p.category === product.category && p._id !== product._id).slice(0, 4)
    : [];

  if (status === 'loading') {
    return <div className="text-center text-gray-500 dark:text-gray-400 py-12">Loading...</div>;
  }

  if (status === 'failed' || !product) {
    return <div className="text-center text-red-500 dark:text-red-400 py-12">Product not found</div>;
  }

  const discountedPrice = product.price * 0.8; // 20% off
  const sizes = ['S', 'M', 'L'];

  return (
    <div className="min-h-screen mt-10 bg-[#f5fafb] dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <section className="mb-8">
          <Link href="/" className="text-[#23565b] hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-4">
            <ChevronLeft size={20} /> Back to Products
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <img
                src={product.media[selectedImage] || '/placeholder.png'}
                alt={product.title}
                className="w-full h-36 sm:h-96 object-contain rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
              />
              <div className="flex gap-2 mt-4 justify-center">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? product.media.length - 1 : prev - 1))}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition-transform hover:scale-105 sm:p-3"
                >
                  <ChevronLeft size={20} />
                </Button>
                <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
                  {product.media.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className={`h-10 w-10 object-cover rounded-lg cursor-pointer transition-opacity duration-300 ${
                        selectedImage === index ? 'opacity-100 border-2 border-blue-500' : 'opacity-50 hover:opacity-75'
                      } snap-center`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedImage((prev) => (prev === product.media.length - 1 ? 0 : prev + 1))}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-blue-100 dark:hover:bg-blue-900 transition-transform hover:scale-105 sm:p-3"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
            <div className="animate-fade-in">
              <h1 className="text-3xl font-serif text-gray-800 dark:text-gray-100 mb-4">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  ${discountedPrice.toFixed(2)}{' '}
                  <span className="line-through text-gray-500 dark:text-gray-400">${product.price.toFixed(2)}</span>
                </p>
                <span className="text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                  20% OFF
                </span>
              </div>
              <p className="text-red-500 dark:text-red-400 font-medium mb-4 animate-pulse">
                {product.stock < 5 ? `Hurry! Only ${product.stock} left in stock!` : `In Stock: ${product.stock}`}
              </p>
              <p className="text-red-500 dark:text-red-400 font-medium mb-4 flex items-center gap-2">
                <span className="animate-pulse">Offer ends in:</span> {timeLeft ? formatTime(timeLeft) : '24h 0m 0s'}
              </p>
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Size:</p>
                <div className="flex gap-2 flex-col sm:flex-row">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                      className={`w-full sm:w-12 h-12 rounded-full transition-transform hover:scale-105 ${
                        selectedSize === size
                          ? 'bg-[#9bced3] hover:bg-blue-600 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900'
                      } sm:h-12`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
                  className="w-full sm:w-12 h-12 rounded-full border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-transform hover:scale-105"
                >
                  <Minus size={16} />
                </Button>
                <span className="w-12 text-center font-medium text-gray-800 dark:text-gray-100">{quantity}</span>
                <Button
                  variant="outline"
                  onClick={() => setQuantity((prev) => (prev < product.stock ? prev + 1 : prev))}
                  className="w-full sm:w-12 h-12 rounded-full border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-transform hover:scale-105"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex gap-4 mb-4 flex-col sm:flex-row">
                <Button
                  onClick={handleAddToCart}
                  className="w-full sm:flex-1 bg-[#9bced3] text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 p-2 sm:p-3 text-sm sm:text-base"
                >
                  <ShoppingCart size={18} className="mr-2" /> Add to Cart - ${discountedPrice.toFixed(2)}
                </Button>
                <div className="relative w-full sm:flex-1">
                  <Button
                    onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                    className="w-full text-white bg-[#9bced3] font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 p-2 sm:p-3 text-sm sm:text-base"
                  >
                    <span>Buy Now - ${discountedPrice.toFixed(2)}</span>
                  </Button>
                  {showPaymentOptions && (
                    <div className="absolute p-4 flex flex-col gap-3 top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg z-50">
                      <Button
                        onClick={() => handleBuyNow('upi')}
                        className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white rounded-t-xl transition-transform hover:scale-105 p-2 text-sm"
                      >
                        Pay with UPI
                      </Button>
                      <Button
                        onClick={() => handleBuyNow('card')}
                        className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white transition-transform hover:scale-105 p-2 text-sm"
                      >
                        Pay with Card
                      </Button>
                      <Button
                        onClick={() => handleBuyNow('cod')}
                        className="w-full text-left bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-b-xl transition-transform hover:scale-105 p-2 text-sm"
                      >
                        <Package size={18} className="mr-2" /> Cash on Delivery
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  className={`w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900 text-gray-800 dark:text-gray-200 font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 ${
                    wishlist.some((item) => item._id === product._id) ? 'text-red-500 dark:text-red-400' : ''
                  } p-2 sm:p-3 text-sm sm:text-base`}
                >
                  <Heart
                    size={18}
                    className="mr-2"
                    fill={wishlist.some((item) => item._id === product._id) ? 'currentColor' : 'none'}
                  />
                  {wishlist.some((item) => item._id === product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900 text-gray-800 dark:text-gray-200 font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 p-2 sm:p-3 text-sm sm:text-base"
                >
                  <Share2 size={18} className="mr-2" /> Share
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 animate-fade-in">
          <h2 className="text-2xl font-serif text-gray-800 dark:text-gray-100 mb-4">Product Description</h2>
          <div
            className="prose dark:prose-invert text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>

        {relatedProducts.length > 0 && (
          <section className="mb-12 animate-fade-in">
            <h2 className="text-2xl font-serif text-gray-800 dark:text-gray-100 mb-4">Frequently Bought Together</h2>
            <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4">
              {relatedProducts.map((related) => (
                <Card key={related._id} className="min-w-[200px] shadow-md hover:shadow-lg transition-shadow snap-center">
                  <img
                    src={related.media[0] || '/placeholder.png'}
                    alt={related.title}
                    className="h-32 w-full object-contain rounded-t-xl transform hover:scale-105 transition-transform"
                  />
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-1">{related.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">${related.price.toFixed(2)}</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        dispatch(addToCart(related));
                        dispatch(toggleCart());
                        toast.success(`${related.title} added to cart!`, { style: { background: '#10B981', color: '#fff' } });
                      }}
                      className="mt-2 w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 p-2 text-sm"
                    >
                      <ShoppingCart size={16} className="mr-1" /> Add
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <Reviews />

        <CartSidebar products={products} />
      </div>
    </div>
  );
};

export default ProductDetail;