import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/useAuth.js';
import { useCart } from '../context/useCart.js';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItemsCount } = useCart();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MERNShop
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium">
              Products
            </Link>

            <Link
              to="/cart"
              aria-label={`Shopping cart with ${totalItemsCount} items`}
              className="relative text-gray-600 hover:text-blue-600 font-medium flex items-center cursor-pointer"
            >
              <ShoppingCart size={22} strokeWidth={2} aria-hidden="true" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-gray-800">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm text-gray-700 hover:text-blue-600 font-medium px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;