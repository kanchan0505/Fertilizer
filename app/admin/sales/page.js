"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, Package, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';

export default function AdminSales() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0]
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

    // Load data
    const storedProducts = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
    const storedSales = getFromStorage(STORAGE_KEYS.SALES, []);
    setProducts(storedProducts);
    setSales(storedSales);
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const product = products.find(p => p.id === parseInt(formData.productId));
    if (!product) return;

    const quantity = parseInt(formData.quantity);
    
    // Check if enough stock
    if (quantity > product.stock) {
      alert('Not enough stock available!');
      return;
    }

    // Create sale record
    const newSale = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      date: formData.date,
      total: quantity * product.price
    };

    // Update sales
    const updatedSales = [newSale, ...sales];
    setSales(updatedSales);
    saveToStorage(STORAGE_KEYS.SALES, updatedSales);

    // Update product stock
    const updatedProducts = products.map(p => 
      p.id === product.id 
        ? {...p, stock: p.stock - quantity}
        : p
    );
    setProducts(updatedProducts);
    saveToStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);

    // Reset form
    setFormData({
      productId: '',
      quantity: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);

    alert('Sale recorded successfully!');
  };

  const handleDeleteSale = (saleId) => {
    if (confirm('Are you sure you want to delete this sale record?')) {
      const sale = sales.find(s => s.id === saleId);
      
      // Restore stock
      const updatedProducts = products.map(p => 
        p.id === sale.productId 
          ? {...p, stock: p.stock + sale.quantity}
          : p
      );
      setProducts(updatedProducts);
      saveToStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);

      // Remove sale
      const updatedSales = sales.filter(s => s.id !== saleId);
      setSales(updatedSales);
      saveToStorage(STORAGE_KEYS.SALES, updatedSales);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const groupedSales = sales.reduce((groups, sale) => {
    const date = sale.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(sale);
    return groups;
  }, {});

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
              <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Record Sale
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Sale Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Record New Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({...formData, productId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.filter(p => p.stock > 0).map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - Stock: {product.stock}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity (bags)</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div className="md:col-span-3 flex gap-2">
                  <Button type="submit">Record Sale</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Sales List */}
        <div className="space-y-6">
          {Object.keys(groupedSales).sort((a, b) => new Date(b) - new Date(a)).map(date => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {formatDate(date)}
                  <span className="text-sm font-normal text-gray-500">
                    ({groupedSales[date].length} sales)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedSales[date].map(sale => (
                    <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Package className="w-5 h-5 text-primary-600" />
                        <div>
                          <h4 className="font-medium">{sale.productName}</h4>
                          <p className="text-sm text-gray-600">
                            {sale.quantity} bags × {formatPrice(sale.price)} = {formatPrice(sale.total)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteSale(sale.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* Daily Total */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Daily Total:</span>
                    <span className="font-bold text-lg text-primary-600">
                      {formatPrice(groupedSales[date].reduce((sum, sale) => sum + sale.total, 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sales.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No sales recorded yet</p>
            <p className="text-gray-400">Start by recording your first sale!</p>
          </div>
        )}
      </div>
    </div>
  );
}