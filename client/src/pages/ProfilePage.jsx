import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const ProfilePage = () => {
  const { user, login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load profile');

        setName(data.data.user.name);
        setEmail(data.data.user.email);
        setOrders(data.data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchProfileData();
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name,
          email,
          ...(password && { password }),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      login(data.data); // Update global auth context
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading account details...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">User Settings</h2>

          {message && <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">{message}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="border-t pt-3">
              <p className="text-xs text-gray-500 mb-2">Leave password fields blank to keep current password.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {updating ? 'Saving...' : 'Update Settings'}
            </button>
          </form>
        </div>

        {/* Order History Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">Order History</h2>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500 space-y-3">
              <p>You haven't placed any orders yet.</p>
              <Link to="/products" className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-700">
                  <tr>
                    <th className="px-3 py-3">Order ID</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Total</th>
                    <th className="px-3 py-3">Paid</th>
                    <th className="px-3 py-3">Delivered</th>
                    <th className="px-3 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 font-mono text-xs text-gray-900">{order._id.substring(18)}</td>
                      <td className="px-3 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-3 font-semibold">${order.totalPrice?.toFixed(2)}</td>
                      <td className="px-3 py-3">
                        {order.isPaid ? (
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Paid</span>
                        ) : (
                          <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">Pending</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {order.isDelivered ? (
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Delivered</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">Processing</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <Link to={`/order-success/${order._id}`} className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;