"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, TrendingUp, Users, Plus, BarChart3, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  const handleLogout = () => {
    saveToStorage(STORAGE_KEYS.ADMIN_AUTH, { authenticated: false });
    router.push('/admin/login');
  };

  // Calculate statistics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock <= 10).length;
  const totalSales = sales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.date).toDateString();
    const today = new Date().toDateString();
    return saleDate === today;
  }).reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Active products in inventory
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Products with ≤10 units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatPrice(todaySales)}</div>
              <p className="text-xs text-muted-foreground">
                Sales made today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{formatPrice(totalSales)}</div>
              <p className="text-xs text-muted-foreground">
                All time revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/admin/products">
              <CardContent className="flex items-center p-6">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <Package className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Products</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/admin/sales">
              <CardContent className="flex items-center p-6">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Record Sales</h3>
                  <p className="text-sm text-gray-600">Log daily sales transactions</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/admin/reports">
              <CardContent className="flex items-center p-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">View Reports</h3>
                  <p className="text-sm text-gray-600">Sales analytics and summaries</p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Products with Low Stock */}
        {lowStockProducts > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.filter(p => p.stock <= 10).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">Stock: {product.stock} bags</p>
                    </div>
                    <Link href="/admin/products">
                      <Button variant="outline" size="sm">
                        Update Stock
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}