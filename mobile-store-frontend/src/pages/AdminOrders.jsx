import { useEffect, useState } from "react";
import { orderService } from "../services";
import { Card } from "../components/common/Card";
import { formatPrice } from "../utils/format";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders();
      setOrders(res.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
      loadOrders(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Manage Orders
        </h1>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Order ID</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Customer</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Total</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4 font-mono text-sm text-slate-600 dark:text-slate-400">
                        {order._id.substring(order._id.length - 8)}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {order.user?.name || "Unknown User"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {order.user?.email}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-medium">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded-full ${
                            order.orderStatus === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.orderStatus === "Processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          className="px-2 py-1 border rounded bg-white text-sm dark:bg-slate-800 dark:border-slate-700"
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminOrders;
