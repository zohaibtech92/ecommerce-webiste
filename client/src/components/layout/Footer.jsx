
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white">
            MERN<span className="text-blue-400">Shop</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            Thoughtful products, straightforward shopping, and dependable delivery for everyday life.
          </p>
          <div className="mt-5 space-y-3 text-sm text-slate-400">
            <p className="flex items-center gap-2"><MapPin size={16} aria-hidden="true" /> Lahore, Pakistan</p>
            <p className="flex items-center gap-2"><Phone size={16} aria-hidden="true" /> +92 300 1234567</p>
            <p className="flex items-center gap-2"><Mail size={16} aria-hidden="true" /> support@mernshop.example</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Shop</h2>
          <nav className="mt-4 space-y-3 text-sm" aria-label="Shop links">
            <Link to="/products" className="block transition hover:text-white">All Products</Link>
            <Link to="/cart" className="block transition hover:text-white">Shopping Cart</Link>
            <Link to="/checkout" className="block transition hover:text-white">Checkout</Link>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Account</h2>
          <nav className="mt-4 space-y-3 text-sm" aria-label="Account links">
            <Link to="/profile" className="block transition hover:text-white">My Account</Link>
            <Link to="/login" className="block transition hover:text-white">Sign In</Link>
            <Link to="/register" className="block transition hover:text-white">Create Account</Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Copyright {new Date().getFullYear()} MERNShop. All rights reserved.</p>
          <p>Secure checkout powered by Stripe</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;