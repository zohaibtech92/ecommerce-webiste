import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/useCart.js';

const ProductDetailPage = () => {
  const { idOrSlug } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/products/${idOrSlug}`);

        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response from server');
        }

        const data = await res.json();

        setProduct(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [idOrSlug]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Product Not Found'}</h2>
        <Link to="/products" className="text-blue-600 hover:underline">
          &larr; Back to Product Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-gray-50 flex justify-center items-center h-96">
            <img
              src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="max-h-full object-contain"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 border-2 rounded overflow-hidden flex-shrink-0 ${
                    selectedImage === idx ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <span className="text-sm text-blue-600 uppercase tracking-wider font-semibold">
            {product.brand}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-2">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">${product.price?.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="bg-red-100 text-red-700 text-sm font-bold px-2.5 py-0.5 rounded">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Stock Availability */}
          <div className="mb-6">
            {product.countInStock > 0 ? (
              <span className="inline-flex items-center text-sm font-medium text-green-600">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
                In Stock ({product.countInStock} available)
              </span>
            ) : (
              <span className="inline-flex items-center text-sm font-medium text-red-600">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></span>
                Out of Stock
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Quantity Selector & Add to Cart */}
          {product.countInStock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 font-semibold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.countInStock, q + 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;