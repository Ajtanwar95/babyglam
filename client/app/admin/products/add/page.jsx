'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { X, Bold, Italic, List } from 'lucide-react';

// TipTap imports
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Dynamically import EditorContent (fix SSR issues)
const EditorContent = dynamic(
  () => import('@tiptap/react').then((mod) => mod.EditorContent),
  { ssr: false }
);

const Toolbar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="flex gap-2 mb-2">
      <Button
        type="button"
        variant={editor.isActive('bold') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('italic') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('bulletList') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </Button>
    </div>
  );
};

const AddProduct = ({ isEdit = false, product = null, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media: [],
    existingMedia: [],
    category: '',
    price: '',
    costPerItem: '',
    weight: '',
    stock: '',
  });
  const [loading, setLoading] = useState(false);

  // Setup TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
      immediatelyRender: false,
    content: '',
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, description: editor.getHTML() }));
    },
  });
// Prefill form for edit mode
  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        media: [],
        existingMedia: product.media || [],
        category: product.category || '',
        price: product.price?.toString() || '',
        costPerItem: product.costPerItem?.toString() || '',
        weight: product.weight?.toString() || '',
        stock: product.stock?.toString() || '',
      });
      editor?.commands.setContent(product.description || '');
    }
  }, [isEdit, product, editor]);
 const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media') {
      const newFiles = Array.from(files).slice(0, 5 - formData.existingMedia.length - formData.media.length);
      if (newFiles.length < files.length) {
        toast({ title: 'Warning', description: 'Maximum 5 media files allowed', variant: 'destructive' });
      }
      setFormData((prev) => ({
        ...prev,
        media: [...prev.media, ...newFiles],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRemoveMedia = (index, isExisting = false) => {
    if (isExisting) {
      setFormData((prev) => ({
        ...prev,
        existingMedia: prev.existingMedia.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        media: prev.media.filter((_, i) => i !== index),
      }));
    }
  };


   const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.media.length + formData.existingMedia.length === 0) {
      toast({ title: 'Error', description: 'At least one media file is required', variant: 'destructive' });
      return;
    }
    if (formData.media.some((file) => file.size > 5 * 1024 * 1024)) {
      toast({ title: 'Error', description: 'Each media file must be less than 5MB', variant: 'destructive' });
      return;
    }
    if (
      parseFloat(formData.price) < 0 ||
      parseFloat(formData.costPerItem) < 0 ||
      parseFloat(formData.weight) < 0 ||
      parseInt(formData.stock) < 0
    ) {
      toast({ title: 'Error', description: 'Price, cost, weight, and stock must be non-negative', variant: 'destructive' });
      return;
    }
    if (!formData.title || !formData.description || !formData.category) {
      toast({ title: 'Error', description: 'Title, description, and category are required', variant: 'destructive' });
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    formData.media.forEach((file) => data.append('media', file));
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('costPerItem', formData.costPerItem);
    data.append('weight', formData.weight);
    data.append('stock', formData.stock);

    try {
      setLoading(true);
      const url = isEdit ? `http://localhost:5000/api/v2/products/${product._id}` : 'http://localhost:5000/api/v2/products/add';
      const method = isEdit ? 'patch' : 'post';
      const response = await axios[method](url, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({
        title: 'Success',
        description: response.data.message,
      });
      setFormData({
        title: '',
        description: '',
        media: [],
        existingMedia: [],
        category: '',
        price: '',
        costPerItem: '',
        weight: '',
        stock: '',
      });
      editor?.commands.setContent('');
      document.getElementById('media').value = '';
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || `Failed to ${isEdit ? 'update' : 'add'} product`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className='flex justify-between items-center'>

          <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </CardTitle>
          {isEdit && (
            <Button variant="ghost" onClick={onClose} className="text-red-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <X size={20} />
            </Button>
          )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Baby Onesie"
              />
            </div>

            {/* Description with TipTap */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              {editor ? (
                <div>
                  <Toolbar editor={editor} />
                  <EditorContent editor={editor} className="w-full rounded-md border p-2 bg-white dark:bg-gray-800" />
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
              )}
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <Label htmlFor="media">Media (Images/Videos)</Label>
              <Input
                id="media"
                name="media"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleChange}
              />
              {formData.media.length > 0 && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.media.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-24 w-full object-cover rounded-md shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baby Clothing">Baby Clothing</SelectItem>
                  <SelectItem value="Baby Toys">Baby Toys</SelectItem>
                  <SelectItem value="Baby Gear">Baby Gear</SelectItem>
                  <SelectItem value="Nursery">Nursery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price, Cost, Weight, Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPerItem">Cost per Item ($)</Label>
                <Input
                  id="costPerItem"
                  name="costPerItem"
                  type="number"
                  value={formData.costPerItem}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (grams)</Label>
              <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
            </div>

            {/* Submit */}
             <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {loading ? `${isEdit ? 'Updating' : 'Adding'} Product...` : isEdit ? 'Update Product' : 'Add Product'}
              </Button>
              {isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
