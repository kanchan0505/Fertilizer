"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from './ui/button';
import { Leaf, Menu, X, User } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">FarmFresh</span>
              <span className="text-sm text-gray-600 block">Fertilizers</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 font-medium">
              Contact
            </Link>
          </nav>

          {/* Admin Link & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/admin/login"
              className="block py-2 text-primary-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}