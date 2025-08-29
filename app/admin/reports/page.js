"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Calendar, TrendingUp, ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFromStorage, STORAGE_KEYS } from '@/lib/storage';

export default function AdminReports() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeFilter, setTimeFilter] = useState('week'); // week, month, all
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
    const storedSales = getFromStorage(STORAGE_KEYS.SALES, []);
    const storedProducts = getFromStorage(STORAGE_KEYS.PRODUCTS, []);
    setSales(storedSales);
    setProducts(storedProducts);
  }, [router]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getFilteredSales = () => {
    const now = new Date();
    let filterDate = new Date();

    switch (timeFilter) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return sales;
    }

    return sales.filter(sale => new Date(sale.date) >= filterDate);
  };

  const filteredSales = getFilteredSales();

  // Calculate statistics
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
  const averageOrderValue = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  // Group sales by date
  const salesByDate = filteredSales.reduce((groups, sale) => {
    const date = sale.date;
    if (!groups[date]) {
      groups[date] = { revenue: 0, quantity: 0, orders: 0 };
    }
    groups[date].revenue += sale.total;
    groups[date].quantity += sale.quantity;
    groups[date].orders += 1;
    return groups;
  }, {});

  // Top selling products
  const productSales = filteredSales.reduce((groups, sale) => {
    if (!groups[sale.productId]) {
      groups[sale.productId] = {
        productName: sale.productName,
        totalQuantity: 0,
        totalRevenue: 0,
        orders: 0
      };
    }
    groups[sale.productId].totalQuantity += sale.quantity;
    groups[sale.productId].totalRevenue += sale.total;
    groups[sale.productId].orders += 1;
    return groups;
  }, {});

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

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
              <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Period:</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                {timeFilter === 'week' ? 'Last 7 days' : timeFilter === 'month' ? 'Last 30 days' : 'All time'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
              <Package className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{totalQuantity}</div>
              <p className="text-xs text-muted-foreground">
                Total bags sold
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{filteredSales.length}</div>
              <p className="text-xs text-muted-foreground">
                Number of transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{formatPrice(averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">
                Per transaction
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{product.productName}</h4>
                        <p className="text-sm text-gray-600">
                          {product.totalQuantity} bags sold • {product.orders} orders
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {formatPrice(product.totalRevenue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No sales data available</p>
              )}
            </CardContent>
          </Card>

          {/* Daily Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(salesByDate).length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.keys(salesByDate)
                    .sort((a, b) => new Date(b) - new Date(a))
                    .slice(0, 10)
                    .map(date => (
                    <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">
                          {new Date(date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {salesByDate[date].quantity} bags • {salesByDate[date].orders} orders
                        </p>
                      </div>
                      <div className="font-semibold text-primary-600">
                        {formatPrice(salesByDate[date].revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No sales data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {filteredSales.length === 0 && (
          <Card className="mt-8">
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No sales data for the selected period</p>
              <p className="text-gray-400">Try selecting a different time range or record some sales first.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}