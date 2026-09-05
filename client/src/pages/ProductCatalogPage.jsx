import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ProductCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, totalProducts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const query = new URLSearchParams(searchParams).toString();
        const endpoint = query
          ? `http://localhost:5000/api/products?${query}`
          : 'http://localhost:5000/api/products';
        const res = await fetch(endpoint);

        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response from server');
        }

        const data = await res.json();
        const responseData = data.data?.products ? data.data : data;

        setProducts(responseData.products || responseData || []);
        setPagination({
          page: responseData.page || 1,
          pages: responseData.pages || 1,
          totalProducts: responseData.totalProducts || 0
        });
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleSortChange = (e) => {
    searchParams.set('sort', e.target.value);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-sm text-gray-500">Showing {pagination.totalProducts} results</p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Sort By:</label>
          <select
            value={sort}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="text-center py-16">Loading products...</div>
      ) : error ? (
        <div className="text-center py-16 text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No products found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalogPage;