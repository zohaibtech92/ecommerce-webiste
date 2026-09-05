import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth.js';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);

  // Form state for creating a new product
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    brand: '',
    countInStock: '',
    image: '',
    description: '',
    isFeatured: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [imageFileName, setImageFileName] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
      setProducts(data.data?.products || data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders/admin', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
      setOrders(data.data || []);
    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, image: reader.result }));
      setImageFileName(file.name);
      setFormError(null);
    };
    reader.onerror = () => setFormError('Unable to read the selected image');
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch(
        editingProductId
          ? `http://localhost:5000/api/products/${editingProductId}`
          : 'http://localhost:5000/api/products',
        {
        method: editingProductId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          countInStock: Number(formData.countInStock),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create product');

      setFormData({
        name: '',
        price: '',
        category: '',
        brand: '',
        countInStock: '',
        image: '',
        description: '',
        isFeatured: false,
      });
      setImageFileName('');
      setEditingProductId(null);

      fetchProducts();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setFormError(null);
    setImageFileName(product.images?.[0]?.url ? 'Existing product image' : '');
    setFormData({
      name: product.name || '',
      price: product.price ?? '',
      category: product.category?.name || product.category || '',
      brand: product.brand || '',
      countInStock: product.countInStock ?? '',
      image: product.images?.[0]?.url || product.image || '',
      description: product.description || '',
      isFeatured: Boolean(product.isFeatured),
    });
  };

  const handleOrderStatus = async (orderId, field, value) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update order');
      setOrders((currentOrders) => currentOrders.map((order) => (
        order._id === orderId ? data.data : order
      )));
    } catch (err) {
      setOrdersError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete product');

      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Management Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Product Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-bold text-gray-900">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
            {editingProductId && (
              <button type="button" onClick={() => { setEditingProductId(null); setFormError(null); }} className="text-sm text-gray-500 hover:text-gray-900">
                Cancel
              </button>
            )}
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Stock</label>
                <input
                  type="number"
                  name="countInStock"
                  required
                  value={formData.countInStock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Brand</label>
                <input
                  type="text"
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Image URL</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                required={!editingProductId && !formData.image}
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {imageFileName && <p className="mt-1 text-xs text-gray-500">{imageFileName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label htmlFor="isFeatured" className="text-sm text-gray-700 font-medium cursor-pointer">
                Mark as Featured Product
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 disabled:opacity-50 mt-2"
            >
              {submitting ? 'Saving...' : editingProductId ? 'Save Product' : 'Create Product'}
            </button>
          </form>
        </div>

        {/* Product List Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">Catalog Inventory</h2>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading inventory...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-700">
                  <tr>
                    <th className="px-3 py-3">Product</th>
                    <th className="px-3 py-3">Price</th>
                    <th className="px-3 py-3">Stock</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 font-medium text-gray-900 flex items-center space-x-3">
                        <img src={p.images?.[0]?.url || p.image} alt="" className="w-8 h-8 rounded object-cover border" />
                        <span className="line-clamp-1">{p.name}</span>
                      </td>
                      <td className="px-3 py-3">${p.price?.toFixed(2)}</td>
                      <td className="px-3 py-3">{p.countInStock}</td>
                      <td className="px-3 py-3">{p.category?.name || p.category}</td>
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={() => handleEditProduct(p)}
                          className="mr-3 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
          <span className="text-sm text-gray-500">{orders.length} total orders</span>
        </div>
        {ordersLoading ? (
          <p className="text-sm text-gray-500">Loading orders...</p>
        ) : ordersError ? (
          <p className="text-sm text-red-600">{ordersError}</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders have been placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-700">
                <tr>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Total</th>
                  <th className="px-3 py-3">Payment</th>
                  <th className="px-3 py-3">Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-3 py-3 font-medium text-gray-900">{order.user?.name || 'Unknown customer'}</td>
                    <td className="px-3 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-3 font-semibold">${order.totalPrice?.toFixed(2)}</td>
                    <td className="px-3 py-3">
                      <button onClick={() => handleOrderStatus(order._id, 'isPaid', !order.isPaid)} className={order.isPaid ? 'text-green-700 font-semibold' : 'text-amber-700 font-semibold'}>
                        {order.isPaid ? 'Paid' : 'Mark paid'}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <button onClick={() => handleOrderStatus(order._id, 'isDelivered', !order.isDelivered)} className={order.isDelivered ? 'text-green-700 font-semibold' : 'text-gray-600 font-semibold'}>
                        {order.isDelivered ? 'Delivered' : 'Mark delivered'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;