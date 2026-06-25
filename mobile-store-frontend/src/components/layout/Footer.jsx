import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { APP_NAME, ROUTES } from "../../utils/constants";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">{APP_NAME}</h3>
            <p className="text-sm text-slate-400">
              Your trusted online destination for premium smartphones and mobile devices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to={ROUTES.HOME}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.PRODUCTS}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-primary-400" />
                <span className="text-slate-400">+91 1234 567 890</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-primary-400" />
                <span className="text-slate-400">hello@mobilestore.com</span>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 text-primary-400" />
                <span className="text-slate-400">
                  123 Business Street, New Delhi, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-400">
          <p>
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
