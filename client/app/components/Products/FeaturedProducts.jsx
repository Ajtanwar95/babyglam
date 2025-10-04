'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import CartSidebar from '../CartSidebar/CartSidebar';
import { toggleCart, addToCart } from '@/app/redux/slices/cartSlice';
import { fetchProducts } from '@/app/redux/slices/productsSlice';

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(toggleCart());
    toast.success(`${product.title} added to cart!`, {
      style: { background: '#10B981', color: '#fff' },
    });
  };

  const handleCOD = (product) => {
    dispatch(addToCart(product));
    toast.success(`Proceeding with COD for ${product.title}.`, {
      style: { background: '#10B981', color: '#fff' },
    });
    window.location.href = `/checkout?method=cod`; // Redirect to checkout with method
  };

  return (
    <div className="min-h-screen bg-white dark:from-gray-800 dark:to-gray-900">
      <section id="products" className="py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif text-gray-800 dark:text-gray-100 mb-6 tracking-wide">Our Products</h2>
          {status === 'loading' ? (
            <div className="text-center text-gray-500 dark:text-gray-400 animate-pulse">Loading...</div>
          ) : status === 'failed' ? (
            <div className="text-center text-red-500 dark:text-red-400">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No products available</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product._id} href={`/products/${product._id}`} className="block group">
                  <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 transform group-hover:scale-105">
                    <CardHeader>
                      <img
                        src={product.media[0] || '/placeholder.png'}
                        alt={product.title}
                        className="h-28 w-full object-contain rounded-t-xl transition-transform duration-500 group-hover:scale-110"
                      />
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100 line-clamp-1">{product.title}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-300">${product.price.toFixed(2)}</p>
                      {product.stock < 5 && (
                        <p className="text-red-500 dark:text-red-400 text-sm animate-pulse">
                          Only {product.stock} left in stock!
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 transform hover:scale-105 transition-transform"
                      >
                        <ShoppingCart size={16} className="mr-1" /> Add to Cart
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleCOD(product);
                        }}
                        variant="outline"
                        className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900 transform hover:scale-105 transition-transform"
                      >
                        <Package size={16} className="mr-1" /> COD
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <CartSidebar products={products} />
    </div>
  );
};

export default FeaturedProducts;