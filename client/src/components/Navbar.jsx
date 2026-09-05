import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { useCart } from '../context/useCart.js';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">
          MERN<span className="text-gray-800">Shop</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Navigation & Authentication State */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/products" className="hover:text-blue-600">
            Catalog
          </Link>
          <Link
            to="/cart"
            aria-label={`Shopping cart with ${totalItemsCount} items`}
            className="relative flex items-center cursor-pointer hover:text-blue-600"
          >
            <ShoppingCart size={22} strokeWidth={2} aria-hidden="true" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {totalItemsCount}
              </span>
            )}
          </Link>

          {/* User Logged In vs Logged Out */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Hi, <strong className="text-gray-800">{user.name}</strong>
              </span>

              {user.role === 'admin' && (
                <Link to="/admin" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Admin
                </Link>
              )}

              {/* Admin Badge/Link */}
              {user.role === 'admin' && (
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded font-bold uppercase">
                  Admin
                </span>
              )}

              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-blue-500 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;