"use client";

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import { initialProducts } from '@/lib/data';
// Dynamically import the FertilizerModel component with SSR turned off
const FertilizerModel = dynamic(() => import('@/components/FertilizerModel'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center"><p className="text-white/50">Loading 3D Model...</p></div>
});
import dynamic from 'next/dynamic';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize products data
    const storedProducts = getFromStorage(STORAGE_KEYS.PRODUCTS);
    if (storedProducts.length === 0) {
      saveToStorage(STORAGE_KEYS.PRODUCTS, initialProducts);
      setProducts(initialProducts);
    } else {
      setProducts(storedProducts);
    }
    setIsLoading(false);
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden bg-gradient-to-br from-emerald-900 to-slate-800">
          {/* Container for the 3D model - repositioned and resized */}
          <div className="absolute -bottom-16 -right-10 md:right-10 w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[650px] lg:h-[650px] z-10 opacity-80 md:opacity-100 pointer-events-none">
            <FertilizerModel />
          </div>

          <div className="container mx-auto px-6 relative z-20">
            {/* Hero content - aligned to the left */}
            <div className="text-left text-white max-w-xl">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                Nourish Your Growth
              </h1>
              <p className="text-lg md:text-xl mb-8 text-slate-200" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>
                Discover our range of premium, scientifically-formulated fertilizers designed to maximize your yield and enhance soil health.
              </p>
              <a href="#products" className="bg-white text-emerald-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-transform hover:scale-105 inline-block shadow-2xl">
                Explore Products
              </a>
            </div>
          </div>
        </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search fertilizers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* No products found */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Filter className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No products found matching your criteria.</p>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}