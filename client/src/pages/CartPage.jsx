import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart.js';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalItemsCount } = useCart();
  const navigate = useNavigate();

  const shippingCost = subtotal > 100 || cartItems.length === 0 ? 0 : 10;
  const grandTotal = subtotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart <span className="text-lg font-normal text-gray-500">({totalItemsCount} items)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-600 hover:text-red-800 transition font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.images?.[0]?.url || item.image || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <div>
                  <Link
                    to={`/products/${item.slug || item._id}`}
                    className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)} each</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg transition"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-semibold text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg transition"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal per item */}
                <p className="font-bold text-gray-900 w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Remove item */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-gray-400 hover:text-red-600 transition"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Order Summary</h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-gray-900">
                {shippingCost === 0 ? <span className="text-green-600">FREE</span> : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            {subtotal < 100 && (
              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                Add ${(100 - subtotal).toFixed(2)} more to qualify for FREE shipping!
              </p>
            )}
          </div>

          <div className="border-t pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200"
          >
            Proceed to Checkout
          </button>

          <Link
            to="/products"
            className="block text-center text-sm text-blue-600 hover:underline pt-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;