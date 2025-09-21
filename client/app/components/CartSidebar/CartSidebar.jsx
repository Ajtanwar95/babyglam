'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Trash2, ShoppingCart, Package, Gift, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { toggleCart, removeFromCart, updateQuantity, clearCart, dismissOfferPopup, addToCart  } from '@/app/redux/slices/cartSlice';

const CartSidebar = ({ products }) => {
  const dispatch = useDispatch();
  const { items, isOpen, showOfferPopup, offerExpiry } = useSelector((state) => state.cart);
  const [timeLeft, setTimeLeft] = useState(null);

  // Countdown timer for offer popup
  useEffect(() => {
    if (showOfferPopup && offerExpiry) {
      const timer = setInterval(() => {
        const timeRemaining = Math.max(0, offerExpiry - Date.now());
        setTimeLeft(timeRemaining);
        if (timeRemaining <= 0) {
          dispatch(dismissOfferPopup());
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOfferPopup, offerExpiry, dispatch]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    if (items.length >= 3 || subtotal >= 100) {
      discount = subtotal * 0.15; // 15% for 3+ items or $100+
    } else if (items.length >= 2 || subtotal >= 50) {
      discount = subtotal * 0.1; // 10% for 2+ items or $50+
    }
    return { subtotal, discount, total: subtotal - discount };
  };

  const { subtotal, discount, total } = calculateTotal();

  const getSimilarProducts = () => {
    if (items.length === 0) return products.slice(0, 4); // Show random products if cart is empty
    const categories = [...new Set(items.map((item) => item.category))];
    return products
      .filter((p) => categories.includes(p.category) && !items.some((i) => i._id === p._id))
      .slice(0, 4);
  };

  const similarProducts = getSimilarProducts();

  const handleCheckout = (method = 'online') => {
    dispatch(clearCart());
    toast.success(`Proceeding to ${method === 'cod' ? 'Cash on Delivery' : 'Online Checkout'}.`, {
      style: { background: '#10B981', color: '#fff' },
    });
    window.location.href = `/checkout?method=${method}`;
  };

  const handleQuantityChange = (id, quantity, stock) => {
    if (quantity < 1) {
      dispatch(removeFromCart(id));
      toast.info('Item removed from cart.', { style: { background: '#3B82F6', color: '#fff' } });
    } else if (quantity > stock) {
      toast.error(`Only ${stock} in stock`, { style: { background: '#EF4444', color: '#fff' } });
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const freeShippingProgress = Math.min((subtotal / 50) * 100, 100);
  const freeGiftProgress = Math.min((items.length / 3) * 100, 100);

  return (
    <>
      {/* Cart Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-gradient-to-b from-blue-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl transform transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0 scale-100' : 'translate-x-full scale-95'
        } z-50`}
      >
        <div className="flex flex-col h-full">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-pink-100 dark:from-gray-700 dark:to-gray-800">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-serif text-gray-800 dark:text-gray-100 tracking-wide">Your BabyGlam Cart</CardTitle>
              <Button
                variant="ghost"
                onClick={() => dispatch(toggleCart())}
                className="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
              >
                <X size={28} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <ShoppingCart size={64} className="mx-auto mb-4 opacity-50 animate-bounce" />
                <p className="text-lg font-medium">Your cart is empty. Fill it with adorable baby items!</p>
                <Button
                  asChild
                  className="mt-4 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white transform hover:scale-105 transition-transform"
                >
                  <Link href="/">Shop Now</Link>
                </Button>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 group">
                    <img
                      src={item.media[0] || '/placeholder.png'}
                      alt={item.title}
                      className=" h-12 w-12 object-cover rounded-xl shadow-sm transform group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.title}</h3>
                      <p className="text-gray-600 text-sm dark:text-gray-300">${item.price.toFixed(2)} x {item.quantity}</p>
                      {item.quantity >= item.stock && (
                        <p className="text-red-500 dark:text-red-400 text-sm animate-pulse">Max stock reached!</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.stock)}
                          className=" h-3 w-3 p-2 rounded-full border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        >
                          <Minus  />
                        </Button>
                        <span className="w-10 text-center font-medium text-gray-800 dark:text-gray-100">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.stock)}
                          className=" h-3 w-3 p-2 rounded-full border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        >
                          <Plus size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            dispatch(removeFromCart(item._id));
                            toast.info('Item removed from cart.', { style: { background: '#3B82F6', color: '#fff' } });
                          }}
                          className="bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 transform hover:scale-110 transition-transform"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-6 space-y-6">
                  <div>
                    <p className="text-gray-800 dark:text-gray-100 text-lg">Subtotal: ${subtotal.toFixed(2)}</p>
                    {discount > 0 && (
                      <p className="text-green-600 dark:text-green-400 text-lg font-medium">
                        Discount ({items.length >= 3 || subtotal >= 100 ? '15%' : '10%'}): -${discount.toFixed(2)}
                      </p>
                    )}
                    <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Total: ${total.toFixed(2)}</p>
                    {items.length >= 3 && (
                      <p className="text-green-600 dark:text-green-400 flex items-center gap-2 text-lg font-medium">
                        <Gift size={20} className="animate-bounce" /> Free Baby Socks Added!
                      </p>
                    )}
                  </div>
                  {/* Progress Bars */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Free Shipping Progress</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${freeShippingProgress}%` }}
                      ></div>
                    </div>
                    {subtotal < 50 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Spend ${(50 - subtotal).toFixed(2)} more for <span className="font-bold text-blue-600 dark:text-blue-400">free shipping</span>!
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Free Gift Progress</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-pink-700 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${freeGiftProgress}%` }}
                      ></div>
                    </div>
                    {items.length < 3 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Add {3 - items.length} more item{3 - items.length > 1 ? 's' : ''} for a <span className="font-bold text-pink-500">free gift</span>!
                      </p>
                    )}
                  </div>
                </div>
                {similarProducts.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-serif text-gray-800 dark:text-gray-100 mb-4">Explore More</h3>
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
                      {similarProducts.map((product) => (
                        <Card key={product._id} className="min-w-[160px] shadow-md hover:shadow-lg transition-shadow snap-center">
                          <img
                            src={product.media[0] || '/placeholder.png'}
                            alt={product.title}
                            className="h-28 w-full object-cover rounded-t-xl"
                          />
                          <CardContent className="p-4">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-1">{product.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">${product.price.toFixed(2)}</p>
                            <Button
                              size="sm"
                              onClick={() => {
                                dispatch(addToCart(product));
                                toast.success(`${product.title} added to cart!`, {
                                  style: { background: '#10B981', color: '#fff' },
                                });
                              }}
                              className="mt-2 w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 transform hover:scale-105 transition-transform"
                            >
                              <ShoppingCart size={16} className="mr-1" /> Quick Add
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-t from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
              <Button
                onClick={() => handleCheckout('online')}
                className="w-full mb-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white transform hover:scale-105 transition-transform"
              >
                Checkout Online
              </Button>
              <Button
                onClick={() => handleCheckout('cod')}
                variant="outline"
                className="w-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900 transform hover:scale-105 transition-transform"
              >
                <Package size={18} className="mr-2" /> Cash on Delivery
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Offer Popup */}
      {showOfferPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-2xl overflow-hidden animate-popup">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-pink-500 text-white p-6">
              <CardTitle className="text-2xl font-serif tracking-wide">Exclusive Offer!</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 dark:text-gray-200 mb-4 text-lg font-medium">
                Get <span className="font-bold text-green-600 dark:text-green-400">20% OFF</span> with code{' '}
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">BABYGLAM20</span> or a{' '}
                <span className="font-bold text-pink-500">free gift</span> when you shop now!
              </p>
              <p className="text-sm text-red-500 dark:text-red-400 font-medium mb-4 animate-pulse">
                Hurry! Offer expires in {timeLeft ? formatTime(timeLeft) : '10:00'}!
              </p>
              {similarProducts.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Featured Picks</h4>
                  <div className="flex overflow-x-auto gap-3 pb-2">
                    {similarProducts.slice(0, 3).map((product) => (
                      <Card key={product._id} className="min-w-[120px] shadow-sm hover:shadow-md transition-shadow">
                        <img
                          src={product.media[0] || '/placeholder.png'}
                          alt={product.title}
                          className="h-20 w-full object-cover rounded-t-md"
                        />
                        <CardContent className="p-2">
                          <p className="text-xs font-medium text-gray-800 dark:text-gray-100 line-clamp-1">{product.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">${product.price.toFixed(2)}</p>
                          <Button
                            size="sm"
                            onClick={() => {
                              dispatch(addToCart(product));
                              dispatch(dismissOfferPopup());
                              toast.success(`${product.title} added to cart!`, {
                                style: { background: '#10B981', color: '#fff' },
                              });
                            }}
                            className="mt-1 w-full bg-blue-500 hover:bg-blue-600 text-xs"
                          >
                            Add
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white transform hover:scale-105 transition-transform"
                onClick={() => dispatch(dismissOfferPopup())}
              >
                <Link href="/">Shop Now</Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => dispatch(dismissOfferPopup())}
                className="mt-3 w-full text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
              >
                No Thanks
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartSidebar;