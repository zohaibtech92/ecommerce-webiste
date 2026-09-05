import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Could not fetch order');
        setOrder(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchOrder();
  }, [id, user]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500 font-medium">Loading receipt...</div>;
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-red-50 text-red-600 text-center rounded-xl">
        <p>{error || 'Order not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-md space-y-6">
        <div className="text-center border-b pb-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Placed Successfully!</h1>
          <p className="text-gray-500 text-sm mt-1">Order ID: <span className="font-mono">{order._id}</span></p>
        </div>

        {/* Shipping details */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Shipping Information</h2>
          <p className="text-sm text-gray-600">{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
          <p className="text-sm text-gray-600 mt-1">Payment Method: <span className="font-medium">{order.paymentMethod}</span></p>
        </div>

        {/* Ordered items */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Order Items</h2>
          <div className="space-y-3">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-800">{item.quantity}x {item.name}</span>
                <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Cost */}
        <div className="border-t pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
          <span>Total Paid</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>

        <div className="pt-4 text-center">
          <Link
            to="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;