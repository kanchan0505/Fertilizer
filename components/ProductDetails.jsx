// /components/ProductDetails.js

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Package, CheckCircle, MessageCircle, Minus, Plus, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

// This component receives the 'product' as a prop
export default function ProductDetails({ product }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  
  // All your helper functions remain here
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppOrder = () => {
    // ... (This function remains exactly the same)
    const phoneNumber = "1234567890";
    const totalPrice = product.price * quantity;
    const message = `Hi! I would like to order:\n\n🌱 *Product:* ${product.name}\n💰 *Price:* ${formatPrice(product.price)} per bag\n📦 *Quantity:* ${quantity} bags\n💵 *Total:* ${formatPrice(totalPrice)}\n\nPlease confirm availability and delivery details. Thank you!`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, Math.min(quantity + change, product?.stock || 1));
    setQuantity(newQuantity);
  };
  
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-50' };
    if (stock <= 10) return { text: 'Low Stock', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const stockStatus = getStockStatus(product.stock);

  // The entire JSX structure moves here
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* ... (All your product image and details JSX goes here) ... */}
            {/* For brevity, I'll just show the quantity part */}
             {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                    {stockStatus.text}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{product.stock} bags available</span>
                </div>
                
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary-700">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-gray-600">per 50kg bag</span>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Benefits:</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector & Order */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-3">Quantity:</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total Price:</span>
                    <span className="text-2xl font-bold text-primary-700">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleWhatsAppOrder}
                  disabled={product.stock === 0}
                  size="lg"
                  className="w-full text-lg py-3"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Order via WhatsApp
                </Button>
                
                <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                  <div className="flex items-center gap-2 text-primary-700">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">Call us: +91 98765-43210</span>
                  </div>
                  <p className="text-sm text-primary-600 mt-1">
                    Free delivery within 50km radius
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
