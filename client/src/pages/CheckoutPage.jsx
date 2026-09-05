import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/useCart.js';
import { useAuth } from '../context/useAuth.js';
import StripePaymentForm from '../components/StripePaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const hasStripeKey = Boolean(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY?.startsWith('pk_') &&
  !import.meta.env.VITE_STRIPE_PUBLIC_KEY.includes('your_')
);

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * subtotal).toFixed(2));
  const totalPrice = subtotal + shippingPrice + taxPrice;

  useEffect(() => {
    if (cartItems.length === 0 || paymentMethod !== 'Stripe' || !user?.token || !hasStripeKey) return;

    // Request PaymentIntent clientSecret from backend
    fetch('http://localhost:5000/api/payment/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ items: cartItems, shippingPrice, taxPrice }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Unable to initialize card payment');
        return data;
      })
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((err) => console.error('Error fetching PaymentIntent:', err));
  }, [cartItems, paymentMethod, shippingPrice, taxPrice, user]);

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setShippingAddress((current) => ({ ...current, [name]: value }));
  };

  const buildOrderItems = () => cartItems.map((item) => ({
    product: item._id,
    name: item.name,
    quantity: item.quantity,
    image: item.images?.[0]?.url || item.image || '',
    price: item.price
  }));

  const placeOrder = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          orderItems: buildOrderItems(),
          shippingAddress,
          paymentMethod,
          itemsPrice: subtotal,
          shippingPrice,
          totalPrice
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order creation failed');

      clearCart();
      navigate(`/order-success/${data.data._id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    setLoading(true);

    try {
      // Save order into MongoDB with paid status
      const orderData = {
        orderItems: buildOrderItems(),
        shippingAddress,
        paymentMethod: 'Stripe',
        paymentResult: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: user?.email,
        },
        itemsPrice: subtotal,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: true,
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order creation failed');

      clearCart();
      navigate(`/order-success/${data.data._id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <div className="text-center py-20 text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">Order Summary</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping:</span><span>${shippingPrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax (15%):</span><span>${taxPrice.toFixed(2)}</span></div>
            <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2">
              <span>Total:</span><span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Stripe Card Element */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-4">Payment Details</h2>
          <div className="mb-6 space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
            {Object.entries(shippingAddress).map(([field, value]) => (
              <input
                key={field}
                name={field}
                value={value}
                onChange={handleAddressChange}
                required
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
              />
            ))}
          </div>

          <div className="mb-6 space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
              <input
                type="radio"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              <span>Cash on Delivery</span>
            </label>
            <label className={`flex items-center gap-3 rounded-lg border p-3 ${hasStripeKey ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="Stripe"
                checked={paymentMethod === 'Stripe'}
                onChange={(event) => setPaymentMethod(event.target.value)}
                disabled={!hasStripeKey}
              />
              <span>Credit/Debit Card {!hasStripeKey && '(not configured)'}</span>
            </label>
          </div>

          {paymentMethod === 'Stripe' && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm onPaymentSuccess={handlePaymentSuccess} totalPrice={totalPrice} />
            </Elements>
          )}
          {paymentMethod === 'Stripe' && !clientSecret && (
            <p className="text-sm text-amber-700">Stripe payment is not configured. Choose Cash on Delivery.</p>
          )}
          {paymentMethod !== 'Stripe' && (
            <form onSubmit={placeOrder}>
              <button type="submit" disabled={loading || !user?.token} className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
              {!user?.token && <p className="mt-2 text-sm text-red-600">Please sign in before placing your order.</p>}
            </form>
          )}
          {loading && <p className="mt-4 text-sm text-gray-500">Completing your order...</p>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;