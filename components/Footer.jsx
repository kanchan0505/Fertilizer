import { Leaf, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">FarmFresh Fertilizers</span>
                <p className="text-gray-400 text-sm">Premium Agricultural Solutions</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              We provide high-quality fertilizers to help farmers achieve better yields and sustainable farming practices. 
              Trusted by farmers across the region for over 10 years.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 98765-43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@farmfresh.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>
                  123 Agricultural Market<br />
                  Rural District, State 123456
                </span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <div className="space-y-2 text-gray-400">
              <div>
                <p className="font-medium">Monday - Saturday</p>
                <p>8:00 AM - 6:00 PM</p>
              </div>
              <div>
                <p className="font-medium">Sunday</p>
                <p>9:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 FarmFresh Fertilizers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}