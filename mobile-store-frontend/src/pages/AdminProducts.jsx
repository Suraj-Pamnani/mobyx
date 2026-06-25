import { useState, useEffect } from "react";
import { productService } from "../services";
import { Card, Badge } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { Edit, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice, calculateDiscountedPrice } from "../utils/format";

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    brand: "",
    modelName: "",
    price: "",
    discount: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProducts({ limit: 100 });
      setProducts(res.products || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        brand: product.brand,
        modelName: product.modelName,
        price: product.price,
        discount: product.discount || 0,
        stock: product.stock,
        description: product.description,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        brand: "",
        modelName: "",
        price: "",
        discount: "0",
        stock: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount),
        stock: Number(formData.stock),
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, dataToSubmit);
        toast.success("Product updated");
      } else {
        await productService.createProduct(dataToSubmit);
        toast.success("Product created");
      }
      handleCloseModal();
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(id);
      toast.success("Product deleted");
      loadProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Manage Products</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{product.modelName}</div>
                      <div className="text-sm text-slate-500">{product.brand}</div>
                    </td>
                    <td className="p-4">
                      {product.discount > 0 ? (
                        <>
                          <div className="text-red-600 font-bold">{formatPrice(calculateDiscountedPrice(product.price, product.discount))}</div>
                          <div className="text-xs text-slate-400 line-through">{formatPrice(product.price)}</div>
                        </>
                      ) : (
                        <div className="font-bold">{formatPrice(product.price)}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge variant={product.stock > 0 ? "success" : "danger"}>
                        {product.stock} in stock
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(product)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={handleCloseModal} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <input required name="brand" value={formData.brand} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Model Name</label>
                <input required name="modelName" value={formData.modelName} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (?)</label>
                  <input required type="number" min="0" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount (%)</label>
                  <input type="number" min="0" max="100" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 bg-white" />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit">{editingProduct ? "Update" : "Save"}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
export default AdminProducts;
