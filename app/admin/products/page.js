"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Package, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    category: '',
    benefits: []
  });
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const auth = getFromStorage(STORAGE_KEYS.ADMIN_AUTH, null);
    if (!auth?.authenticated) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);

    // Load products
    const storedProducts = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
    setProducts(storedProducts);
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProduct = {
      ...formData,
      id: editingProduct ? editingProduct.id : Date.now(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      benefits: formData.benefits.filter(b => b.trim() !== '')
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? newProduct : p);
    } else {
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    saveToStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      image: '',
      category: '',
      benefits: []
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      saveToStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);
    }
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({...formData, benefits: newBenefits});
  };

  const addBenefit = () => {
    setFormData({...formData, benefits: [...formData.benefits, '']});
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({...formData, benefits: newBenefits});
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/admin/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Product Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Compound">Compound</option>
                    <option value="Nitrogen">Nitrogen</option>
                    <option value="Phosphorus">Phosphorus</option>
                    <option value="Potassium">Potassium</option>
                    <option value="Organic">Organic</option>
                    <option value="Secondary">Secondary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹ per bag)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stock (bags)</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://images.pexels.com/..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Benefits</label>
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={benefit}
                        onChange={(e) => handleBenefitChange(index, e.target.value)}
                        placeholder="Enter benefit"
                      />
                      <Button type="button" variant="outline" onClick={() => removeBenefit(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addBenefit}>
                    Add Benefit
                  </Button>
                </div>

                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Stock:</span>
                    <span className={`font-semibold ${
                      product.stock <= 10 ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {product.stock} bags
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}