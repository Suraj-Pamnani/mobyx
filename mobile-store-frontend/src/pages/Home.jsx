import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Zap, Shield, Truck } from "lucide-react";
import { Button } from "../../components/common/Button";
import { ProductGrid } from "../../components/product/ProductCard";
import { ProductSkeleton } from "../../components/common/Skeleton";
import { productService } from "../../services";
import { ROUTES } from "../../utils/constants";
import toast from "react-hot-toast";

const features = [
  {
    icon: Smartphone,
    title: "Latest Models",
    description: "Get the newest smartphones from top brands",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Quick and reliable shipping to your doorstep",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure and encrypted transactions",
  },
  {
    icon: Truck,
    title: "Easy Returns",
    description: "Hassle-free returns within 30 days",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts({ limit: 8 });
        setProducts(response.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-slate-900 px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6 leading-tight">
              Your Ultimate <span className="text-primary-600 dark:text-primary-400">Mobile Store</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Discover the latest smartphones and enjoy exclusive deals. Premium devices, authentic products, and world-class customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate(ROUTES.PRODUCTS)}
                  variant="primary"
                  size="lg"
                  className="group"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(ROUTES.PRODUCTS)}
              >
                Browse Catalog
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 opacity-10 dark:opacity-5">
          <Smartphone className="w-96 h-96 text-primary-600" />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={item}
                className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center"
              >
                <Icon className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              Featured Products
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Check out our latest and most popular smartphones
            </p>
          </motion.div>
        </div>

        {loading ? (
          <ProductSkeleton count={8} />
        ) : (
          <ProductGrid products={products} loading={false} />
        )}

        {/* View All Products Button */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate(ROUTES.PRODUCTS)}
            variant="primary"
            size="lg"
            className="group"
          >
            View All Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-700 dark:to-blue-700 rounded-2xl p-8 sm:p-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Find Your Perfect Phone Today
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            With hundreds of models from leading brands, we're sure you'll find exactly what you're looking for.
          </p>
          <Button
            onClick={() => navigate(ROUTES.PRODUCTS)}
            variant="primary"
            size="lg"
            className="bg-white text-primary-600 hover:bg-slate-100"
          >
            Start Shopping
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
};
