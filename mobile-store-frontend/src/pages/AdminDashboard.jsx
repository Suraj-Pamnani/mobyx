import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Card } from "../components/common/Card";
import { productService, orderService } from "../services";
import { formatPrice } from "../utils/format";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Fetch products to get count
        const productsRes = await productService.getAllProducts({ limit: 1 });
        
        // Fetch orders to get count, revenue, and recent orders
        const ordersRes = await orderService.getAllOrders();
        const orders = ordersRes.orders || [];
        
        const revenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        
        setStats({
          totalProducts: productsRes.totalProducts || 0,
          totalOrders: orders.length,
          totalRevenue: revenue,
          recentOrders: orders.slice(0, 5) // Get top 5 recent orders
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Overview of your store's performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
            <Package className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Products</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stats.totalProducts}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
            <ShoppingCart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Orders</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stats.totalOrders}</h3>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{formatPrice(stats.totalRevenue)}</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link 
              to="/admin/products" 
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Manage Products</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
            </Link>

            <Link 
              to="/admin/orders" 
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Manage Orders</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
            </Link>
          </div>
        </Card>

        {/* Recent Orders Preview */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                      {order.user?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.orderStatus === "Delivered" ? "bg-green-100 text-green-700" :
                      order.orderStatus === "Processing" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No recent orders found.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
