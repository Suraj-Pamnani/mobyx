import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut, User, Home, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { Button } from "../common/Button";
import { ROUTES, APP_NAME } from "../../utils/constants";
import toast from "react-hot-toast";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartCount = cart?.items?.length || 0;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate(ROUTES.LOGIN);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", href: ROUTES.HOME, icon: Home },
    { label: "Products", href: ROUTES.PRODUCTS, icon: Package },
  ];

  if (user?.role === "admin") {
    navLinks.push({ label: "Dashboard", href: "/admin/dashboard", icon: Home });
    navLinks.push({ label: "Products", href: "/admin/products", icon: Package });
    navLinks.push({ label: "Orders", href: "/admin/orders", icon: ShoppingCart });
  }

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
              {APP_NAME}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.role}
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  size="sm"
                  className="hidden sm:flex"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  variant="secondary"
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  variant="primary"
                  size="sm"
                >
                  Register
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="px-2 py-4 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}

                {user ? (
                  <>
                    <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-1">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        {user.email}
                      </p>
                      <Button
                        onClick={handleLogout}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 mt-2 space-y-2">
                    <Button
                      onClick={() => {
                        navigate(ROUTES.LOGIN);
                        setMobileMenuOpen(false);
                      }}
                      variant="secondary"
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        navigate(ROUTES.REGISTER);
                        setMobileMenuOpen(false);
                      }}
                      variant="primary"
                      className="w-full"
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
