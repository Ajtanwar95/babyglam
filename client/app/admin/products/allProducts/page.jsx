'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
// import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { Trash2, Edit } from 'lucide-react';
import AddProduct from '../add/page';

const AllProducts = () => {
//   const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/v2/products');
      setProducts(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch products: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/v2/products/${id}`);
      toast({
        title: 'Success',
        description: 'Product deleted',
      });
      fetchProducts(); // Refresh product list
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
    fetchProducts(); // Refresh after edit
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      {editingProduct ? (
        <AddProduct isEdit={true} product={editingProduct} onClose={handleCloseEdit} />
      ) : (
        <Card className="max-w-5xl mx-auto shadow-lg">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              All Products
            </CardTitle>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <a href="/admin/products/add">Add New Product</a>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400">No products found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Image</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Title</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Category</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Price ($)</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Stock</TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                        <TableCell>
                          {product.media[0] ? (
                            <img
                              src={product.media[0]}
                              alt={product.title}
                              className="h-12 w-12 object-cover rounded-md"
                            />
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">No image</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-gray-800 dark:text-gray-100">{product.title}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">{product.category}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">{product.stock}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="border-gray-300 dark:border-gray-600"
                            >
                              <Edit size={16} className="mr-1" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(product._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 size={16} className="mr-1" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AllProducts;