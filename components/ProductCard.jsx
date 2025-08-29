"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart, Package } from 'lucide-react';

export default function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (stock <= 10) return { text: 'Low Stock', color: 'text-orange-600 bg-orange-50' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
          {stockStatus.text}
        </div>
      </div>
      
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
              {product.name}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {product.description}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {product.stock} bags available
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary-700">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">per 50kg bag</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/product/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Link href={`/product/${product.id}`}>
            <Button size="icon" disabled={product.stock === 0}>
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}