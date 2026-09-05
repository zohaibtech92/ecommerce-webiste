import { useEffect, useState } from 'react';
import { fetchProducts } from '../services/productService';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [usingFallbackProducts, setUsingFallbackProducts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoading(true);
        const featuredData = await fetchProducts({ isFeatured: true, limit: 8 });
        let products = featuredData.data.products;

        if (products.length === 0) {
          const fallbackData = await fetchProducts({ limit: 8 });
          products = fallbackData.data.products;
          setUsingFallbackProducts(true);
        }

        setFeaturedProducts(products);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch featured products');
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="space-y-12 py-8">
      {/* Hero Banner */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Discover Premium Products
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto mb-6 text-base">
          Explore top-quality products with competitive pricing, instant shipping, and dedicated support.
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Browse Full Catalog
        </Link>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {usingFallbackProducts ? 'Latest Products' : 'Featured Products'}
        </h2>
        {loading ? (
          <Loader label="Loading featured items..." />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </section>
    </div>
  );
};

export default HomePage;